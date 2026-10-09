import type { LLMProvider } from "../llm";
import type {
  DecisionOption,
  EthicalPrinciple,
  EthicsCase,
  EthicsAnalysis,
  PrincipleId,
  ReflectionReport,
  Session,
} from "../schemas";

export const PRINCIPLES: Record<PrincipleId, EthicalPrinciple> = {
  confidentiality: { id: "confidentiality", label: "保密", description: "尊重服务对象的隐私与信任，信息披露需有正当理由。" },
  autonomy: { id: "autonomy", label: "自主", description: "尊重服务对象参与并影响与自己有关的决定的权利。" },
  safety: { id: "safety", label: "安全", description: "保护服务对象及他人免受严重、可预见的伤害。" },
  minimize_harm: { id: "minimize_harm", label: "最小伤害", description: "在各种伤害之间选择总体伤害更小的路径。" },
  professional_responsibility: { id: "professional_responsibility", label: "专业责任", description: "履行角色所赋予的法定与专业义务，接受督导与问责。" },
  family_relationship: { id: "family_relationship", label: "家庭关系", description: "关注介入对家庭系统与长期关系的影响。" },
  professional_boundary: { id: "professional_boundary", label: "专业边界", description: "维持清晰的专业关系，避免利益冲突与角色混淆。" },
  justice: { id: "justice", label: "公平", description: "公正对待不同的人与群体，合理分配有限的资源与机会。" },
  client_best_interest: { id: "client_best_interest", label: "服务对象最佳利益", description: "以服务对象的长远福祉为考量，而不仅是眼前的意愿或他人的期待。" },
};

export const DISCLAIMER =
  "本模拟基于虚构的合成案例。AI 提供的是反思材料与不同的伦理视角，而不是“正确答案”或最终专业判断。涉及人身安全、儿童保护、法律与强制干预的真实决定，必须由具备专业责任的人，在督导与相关制度支持下作出。";

/** 单次选择的伦理分析：完全来自案例中可审阅的结构化标注，可追溯。 */
export function analyzeOption(c: EthicsCase, option: DecisionOption): EthicsAnalysis {
  const principles = [...new Set([...option.protects, ...option.sacrifices])];
  const conflicts = c.ethical_conflicts
    .filter((x) => principles.includes(x.between[0]) && principles.includes(x.between[1]))
    .map((x) => ({ a: x.between[0], b: x.between[1], note: x.note }));
  return {
    ethical_issue: c.title,
    ethical_principles: principles,
    value_conflicts: conflicts,
    potential_harms: option.sacrifices.map((p) => `${PRINCIPLES[p].label}可能被削弱`),
    potential_benefits: option.protects.map((p) => `${PRINCIPLES[p].label}得到保护`),
    professional_boundaries: [],
    uncertainty: ["服务对象与家庭的后续反应无法确定", "案例信息不完整，部分事实尚未核实"],
    alternative_actions: [],
    possible_consequences: option.consequences,
    relevant_standards: c.knowledge_sources,
  };
}

const STANCES: { stance: string; principles: PrincipleId[]; argument: string }[] = [
  {
    stance: "保护优先视角",
    principles: ["safety", "professional_responsibility", "minimize_harm"],
    argument: "当存在严重、可预见的伤害时，防止伤害优先于其他价值；专业角色赋予社工无法推卸的责任。",
  },
  {
    stance: "自主与信任视角",
    principles: ["autonomy", "confidentiality"],
    argument: "服务对象不是被动的“被保护对象”。若其意愿与信任被无视，可能导致今后不再求助——短期的保护可能以长期的求助关系为代价。",
  },
  {
    stance: "关系与系统视角",
    principles: ["family_relationship", "client_best_interest"],
    argument: "任何介入都会改变服务对象所处的关系与系统。需要评估介入方式是否会激化风险，或破坏对其最重要的支持关系。",
  },
  {
    stance: "公平与制度视角",
    principles: ["justice", "professional_boundary"],
    argument: "个案中的选择也是一种资源与规则的选择。需要追问：这样做对其他人公平吗？是否越过了角色与机构允许的边界？",
  },
  {
    stance: "关怀伦理视角",
    principles: ["autonomy", "safety", "client_best_interest"],
    argument: "关注的不是抽象规则，而是这段具体的关系：如何在诚实、陪伴与保护之间，让对方不孤单地面对接下来的事。",
  },
];

/** 生成最终反思报告：呈现价值取向而非评分。 */
export async function buildReflection(
  provider: LLMProvider,
  c: EthicsCase,
  session: Session,
  rationales: Record<string, string> = {},
): Promise<ReflectionReport> {
  const path = session.decisions.map((d) => {
    const node = c.decision_nodes.find((n) => n.id === d.node_id)!;
    if (d.custom) {
      return {
        node_prompt: node.prompt,
        chosen: `（自拟）${d.custom.text}`,
        protects: d.custom.protects,
        sacrifices: d.custom.sacrifices,
        consequences: d.custom.consequences,
        rationale: rationales[d.node_id] ?? d.rationale,
        custom: true,
        analysis_source: d.custom.analysis_source,
      };
    }
    const opt = node.options.find((o) => o.id === d.option_id)!;
    return {
      node_prompt: node.prompt,
      chosen: opt.label,
      protects: opt.protects,
      sacrifices: opt.sacrifices,
      consequences: opt.consequences,
      rationale: rationales[d.node_id] ?? d.rationale,
    };
  });

  const tally = new Map<PrincipleId, { protected: number; sacrificed: number }>();
  for (const step of path) {
    for (const p of step.protects) tally.set(p, { protected: (tally.get(p)?.protected ?? 0) + 1, sacrificed: tally.get(p)?.sacrificed ?? 0 });
    for (const p of step.sacrifices) tally.set(p, { protected: tally.get(p)?.protected ?? 0, sacrificed: (tally.get(p)?.sacrificed ?? 0) + 1 });
  }
  const value_profile = [...tally.entries()].map(([principle, v]) => ({ principle, ...v }));

  const touched = new Set(value_profile.map((v) => v.principle));
  const value_conflicts = c.ethical_conflicts
    .filter((x) => touched.has(x.between[0]) || touched.has(x.between[1]))
    .map((x) => ({ a: x.between[0], b: x.between[1], note: x.note }));

  const perspectives = STANCES.map((s) => {
    const sacrificedInPath = s.principles.filter((p) => tally.get(p)?.sacrificed);
    const note = sacrificedInPath.length
      ? `从这个视角看，你的路径在「${sacrificedInPath.map((p) => PRINCIPLES[p].label).join("、")}」上作出了让步，值得追问其理由与代价。`
      : `你的路径在这个视角所重视的价值上大体是一致的。`;
    return { stance: s.stance, argument: `${s.argument} ${note}` };
  });

  const report: ReflectionReport = {
    session_id: session.session_id,
    case_title: c.title,
    path,
    value_profile,
    state_trajectory: session.state_history,
    value_conflicts,
    perspectives,
    uncertainty: [
      ...c.uncertainties,
      "服务对象的反应由 AI 模拟，只是可能性之一，并非预测。",
      "不同地区对相关义务与流程的规定不同，请核对你所在地区的具体规定，而不要依赖本系统。",
    ],
    reflection_questions: c.reflection_questions,
    transcript: session.agent.memory.map((m) => ({ speaker: m.speaker, text: m.text })),
    client_name: session.agent.profile.name,
    created_at: session.created_at,
    generated_by: "rule-based",
    disclaimer: DISCLAIMER,
  };

  if (provider.generative) {
    try {
      report.narrative = (
        await provider.generate(
          "你是社会工作伦理教育的反思助手。不要给出对错判断或评分；说明每个选择保护了什么、牺牲了什么；用简洁、克制的中文，不超过 300 字；不要编造任何法规或文献引用。",
          `案例：${c.title}\n用户的决策路径：\n${path
            .map((p, i) => `${i + 1}. ${p.chosen}（保护：${p.protects.map((x) => PRINCIPLES[x].label).join("、")}；牺牲：${p.sacrifices.map((x) => PRINCIPLES[x].label).join("、")}）${p.rationale ? " 用户理由：" + p.rationale : ""}`)
            .join("\n")}\n请写一段反思性点评。`,
          { temperature: 0.5, maxTokens: 700 },
        )
      ).trim();
      report.generated_by = `${provider.info.name}:${provider.info.model}`;
    } catch {
      /* 降级为规则版报告 */
    }
  }
  return report;
}
