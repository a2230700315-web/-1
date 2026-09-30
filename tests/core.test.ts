import { describe, expect, it } from "vitest";
import { applyEffects, classifyApproachByRules, APPROACH_EFFECTS } from "@/core/agents/state";
import { getCase, listCases } from "@/core/cases";
import { buildReflection } from "@/core/ethics";
import { MockProvider } from "@/core/llm/mock";
import { createSession, decide, decisionReady, sendMessage } from "@/core/simulation/engine";

const provider = new MockProvider();

describe("state mechanism", () => {
  it("classifies approaches by explainable rules", () => {
    expect(classifyApproachByRules("你必须说出来")).toBe("coercive_questioning");
    expect(classifyApproachByRules("我保证不告诉任何人")).toBe("false_promise");
    expect(classifyApproachByRules("不着急，慢慢说，我在")).toBe("professional_empathy");
  });
  it("clamps state to 0-100", () => {
    const s = applyEffects({ trust: 98, fear: 1, anger: 0, willingness_to_disclose: 0, risk_level: 0, dependency: 0, relationship_quality: 0 }, [
      { key: "trust", delta: 20, reason: "" },
      { key: "fear", delta: -20, reason: "" },
    ]);
    expect(s.trust).toBe(100);
    expect(s.fear).toBe(0);
  });
  it("every effect carries a reason", () => {
    for (const es of Object.values(APPROACH_EFFECTS)) for (const e of es) expect(e.reason).not.toBe("");
  });
});

describe("case data", () => {
  it("is synthetic and every option is annotated with values", () => {
    for (const c of listCases()) {
      expect(c.synthetic).toBe(true);
      for (const n of c.decision_nodes) for (const o of n.options) {
        expect(o.protects.length + o.sacrifices.length).toBeGreaterThan(1);
        expect(o.consequences.length).toBeGreaterThan(1);
      }
    }
  });
  it("does not present unverified sources as verified", () => {
    for (const s of getCase("minor-dv-confidentiality-v1")!.knowledge_sources) expect(s.verified).toBe(false);
  });
});

describe("simulation flow (mock provider)", () => {
  it("runs conversation → decisions → reflection", async () => {
    const s = createSession("minor-dv-confidentiality-v1");
    const c = getCase(s.case_id)!;
    expect(decisionReady(c, s)).toBe(false);
    await sendMessage(provider, s, "不着急，慢慢说，我在这里");
    await sendMessage(provider, s, "谢谢你愿意告诉我");
    expect(s.agent.state.trust).toBeGreaterThan(c.initial_client_state.trust);
    expect(s.agent.memory.length).toBeGreaterThan(4);
    expect(decisionReady(c, s)).toBe(true);
    await decide(provider, s, "n1-b");
    expect(s.finished).toBe(false);
    await sendMessage(provider, s, "你想怎么做？");
    await decide(provider, s, "n2-a", "希望他参与");
    expect(s.finished).toBe(true);
    expect(s.decisions).toHaveLength(2);
    const r = await buildReflection(provider, c, s);
    expect(r.path).toHaveLength(2);
    expect(r.value_profile.length).toBeGreaterThan(2);
    expect(r.disclaimer).toContain("最终专业判断");
  });
  it("rejects decisions before enough turns", async () => {
    const s = createSession("minor-dv-confidentiality-v1");
    await expect(decide(provider, s, "n1-a")).rejects.toThrow();
  });
});
