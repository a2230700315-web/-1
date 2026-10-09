import { describe, expect, it } from "vitest";
import { validateCase } from "@/core/cases/validate";
import { listCases } from "@/core/cases";
import type { EthicsCase } from "@/core/schemas";
import { buildReflection } from "@/core/ethics";
import { MockProvider } from "@/core/llm/mock";
import { createSession, currentNode, decide, decisionFrame, decisionReady, sendMessage } from "@/core/simulation/engine";

// 自动发现 src/core/cases 下所有导出的案例，哪怕尚未登记进 registry
const files = import.meta.glob("../src/core/cases/*.ts", { eager: true }) as Record<string, Record<string, unknown>>;
const discovered: EthicsCase[] = Object.values(files)
  .flatMap((m) => Object.values(m))
  .filter((v): v is EthicsCase => !!v && typeof v === "object" && "case_id" in (v as object) && "decision_nodes" in (v as object));

describe("case quality gate", () => {
  it("finds cases", () => expect(discovered.length).toBeGreaterThan(0));
  for (const c of discovered) {
    it(`${c.case_id} passes validation`, () => expect(validateCase(c)).toEqual([]));
  }
  it("registry contains every discovered case, with unique ids", () => {
    const ids = listCases().map((c) => c.case_id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of discovered) expect(ids).toContain(c.case_id);
  });
});

describe("every registered case runs end-to-end (offline)", () => {
  const provider = new MockProvider();
  for (const c of listCases()) {
    it(`${c.case_id}: conversation → decisions → reflection`, async () => {
      const s = createSession(c.case_id);
      for (let ni = 0; ni < c.decision_nodes.length; ni++) {
        const node = currentNode(c, s)!;
        expect(decisionReady(c, s)).toBe(false); // 决策不会一开始就可进入
        for (let i = 0; i < node.minTurns; i++) {
          expect(decisionReady(c, s)).toBe(false);
          await sendMessage(provider, s, c.suggested_prompts[i % 4]);
        }
        expect(decisionReady(c, s)).toBe(true);
        expect(decisionFrame(node, s).narration.length).toBeGreaterThan(10);
        await decide(provider, s, node.options[ni % node.options.length].id, "测试理由");
      }
      expect(s.finished).toBe(true);
      const r = await buildReflection(provider, c, s);
      expect(r.path).toHaveLength(c.decision_nodes.length);
      expect(r.transcript.length).toBeGreaterThan(4);
      expect(r.reflection_questions).toEqual(c.reflection_questions);
    });
  }
});

describe("decision flow adapts to the conversation", () => {
  const provider = new MockProvider();
  const c = listCases()[0];
  it("uses the low-disclosure framing when trust was not built", async () => {
    const s = createSession(c.case_id);
    const node = currentNode(c, s)!;
    for (let i = 0; i < node.minTurns; i++) await sendMessage(provider, s, "你必须说出来，快说");
    expect(decisionFrame(node, s).low_disclosure).toBe(true);
    expect(decisionFrame(node, s).narration).toBe(node.lowDisclosureNarration);
  });
  it("uses the standard framing after building trust", async () => {
    const s = createSession(c.case_id);
    const node = currentNode(c, s)!;
    for (let i = 0; i < node.minTurns + 2; i++) await sendMessage(provider, s, "不着急，慢慢说，我在这里");
    expect(decisionFrame(node, s).low_disclosure).toBe(false);
  });
  it("the client remembers what happened after a decision", async () => {
    const { buildSystemPrompt } = await import("@/core/agents/client-agent");
    const s = createSession(c.case_id);
    const node = currentNode(c, s)!;
    for (let i = 0; i < node.minTurns; i++) await sendMessage(provider, s, "不着急，慢慢说");
    await decide(provider, s, node.options[0].id);
    expect(buildSystemPrompt(s.agent)).toContain(node.options[0].label);
  });
});

describe("custom (free-text) decisions", () => {
  const provider = new MockProvider();
  const c = listCases()[0];

  async function ready() {
    const s = createSession(c.case_id);
    const node = currentNode(c, s)!;
    for (let i = 0; i < node.minTurns; i++) await sendMessage(provider, s, "不着急，慢慢说");
    return { s, node };
  }

  it("accepts a self-written decision, advances the story, and marks it as unanalysed offline", async () => {
    const { s, node } = await ready();
    const r = await decide(provider, s, "custom", undefined, "我会先告诉他我听到了，再问他最担心什么");
    expect(r.option.id).toBe("custom");
    expect(r.option.protects).toEqual([]); // 离线不编造价值标注
    expect(s.decisions[0].custom?.analysis_source).toBe("none");
    expect(s.decisions[0].branch_key).toBe("custom");
    expect(s.node_index).toBe(1);
    // 第二节点在“custom”分支下仍有叙述（回退到 default）
    const { nodeNarration } = await import("@/core/simulation/engine");
    expect(nodeNarration(c.decision_nodes[1], s).length).toBeGreaterThan(5);
    // 服务对象记得学生自己的决定
    const { buildSystemPrompt } = await import("@/core/agents/client-agent");
    expect(buildSystemPrompt(s.agent)).toContain("我会先告诉他我听到了");
    expect(node.id).toBe("n1");
  });

  it("rejects empty or too-short custom text", async () => {
    const { s } = await ready();
    await expect(decide(provider, s, "custom", undefined, "  ")).rejects.toThrow();
    await expect(decide(provider, s, "custom", undefined, "好")).rejects.toThrow();
  });

  it("uses model analysis when available, and sanitizes it", async () => {
    const fake = {
      ...provider,
      generative: true,
      info: { name: "fake", model: "f", version: "1" },
      structuredOutput: async () => ({
        label: "先倾听再商量",
        protects: ["autonomy", "bogus", "autonomy"],
        sacrifices: ["safety", "autonomy"],
        consequences: ["短期更愿意说", "长期不确定"],
        outcome: "对方可能会多说一些。",
        effects: [
          { key: "trust", delta: 99, reason: "被倾听" },
          { key: "nonsense", delta: 5, reason: "x" },
          { key: "fear", delta: 0, reason: "零无效" },
        ],
      }),
      generate: async () => "",
      chat: async () => "（他点了点头）",
    } as unknown as MockProvider;
    const { s } = await ready();
    const before = s.agent.state.trust;
    const r = await decide(fake, s, "custom", undefined, "先听他说完，再一起商量");
    expect(r.option.protects).toEqual(["autonomy"]);
    expect(r.option.sacrifices).toEqual(["safety"]); // 与 protects 重复的被剔除
    expect(r.option.effects).toHaveLength(1); // 非法 key、零值被过滤
    expect(r.option.effects[0].delta).toBe(15); // 夹在 ±15
    expect(s.agent.state.trust).toBeGreaterThan(before);
    expect(s.decisions[0].custom?.analysis_source).toBe("ai");
    const rep = await buildReflection(provider, c, s);
    expect(rep.path[0].custom).toBe(true);
    expect(rep.path[0].chosen).toContain("自拟");
  });

  it("falls back to unanalysed when the model output is unusable", async () => {
    const bad = { ...provider, generative: true, info: provider.info, structuredOutput: async () => ({ protects: [], sacrifices: [] }), generate: async () => "", chat: async () => "" } as unknown as MockProvider;
    const { s } = await ready();
    const r = await decide(bad, s, "custom", undefined, "我自己想的办法");
    expect(r.option.protects).toEqual([]);
    expect(s.decisions[0].custom?.analysis_source).toBe("none");
  });
});
