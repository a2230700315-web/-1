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
