import { NextResponse } from "next/server";
import { listCases } from "@/core/cases";
import { PRINCIPLES } from "@/core/ethics";
import { checkPasscode } from "@/core/research/expert-auth";
import { REVIEW_DIMENSIONS } from "@/core/schemas";

/** 评议视图：专家需要看到完整的价值标注、后果与状态影响（学生端看不到这些）。 */
export async function GET(req: Request) {
  const auth = checkPasscode(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json({
    dimensions: REVIEW_DIMENSIONS,
    principle_labels: Object.fromEntries(Object.values(PRINCIPLES).map((p) => [p.id, p.label])),
    cases: listCases().map((c) => ({
      case_id: c.case_id,
      version: c.version,
      title: c.title,
      domain: c.domain,
      population: c.population,
      setting: c.setting,
      difficulty: c.difficulty,
      risk_level: c.risk_level,
      initial_state: c.initial_state,
      opening_line: c.opening_line,
      ethical_conflicts: c.ethical_conflicts,
      stakeholders: c.stakeholders,
      institutional_constraints: c.institutional_constraints,
      client: { name: c.client_agent.name, background: c.client_agent.background, decision_policy: c.client_agent.decision_policy, knowledge: c.client_agent.knowledge },
      nodes: c.decision_nodes.map((n) => ({
        id: n.id,
        prompt: n.prompt,
        low_disclosure_prompt: n.lowDisclosurePrompt,
        options: n.options.map((o) => ({
          id: o.id,
          label: o.label,
          description: o.description,
          protects: o.protects,
          sacrifices: o.sacrifices,
          consequences: o.consequences,
          effects: o.effects,
          outcomeNarration: o.outcomeNarration,
        })),
      })),
      knowledge_sources: c.knowledge_sources,
    })),
  });
}
