import type { AgentState, ApproachTag, StateEffect } from "../schemas";

/**
 * 可解释的 State 机制：用户行为 → 行为标签 → 带理由的状态变化。
 * 数值为教学启发式（可调参数），不是经验测量结果。
 */
export const APPROACH_EFFECTS: Record<ApproachTag, StateEffect[]> = {
  professional_empathy: [
    { key: "trust", delta: 6, reason: "专业性共情让他感到被理解" },
    { key: "willingness_to_disclose", delta: 6, reason: "更愿意继续说" },
    { key: "fear", delta: -3, reason: "环境更安全" },
  ],
  coercive_questioning: [
    { key: "trust", delta: -8, reason: "被追问/施压" },
    { key: "fear", delta: 6, reason: "感到被逼迫" },
    { key: "willingness_to_disclose", delta: -10, reason: "选择沉默自保" },
  ],
  boundary_violation: [
    { key: "relationship_quality", delta: -10, reason: "超出专业边界的言行" },
    { key: "dependency", delta: 6, reason: "关系边界模糊，依赖增加" },
  ],
  explains_limits: [
    { key: "trust", delta: 2, reason: "被坦诚对待" },
    { key: "fear", delta: 3, reason: "意识到保密有限度" },
    { key: "relationship_quality", delta: 4, reason: "坦诚提升关系质量" },
  ],
  false_promise: [
    { key: "trust", delta: 6, reason: "获得了想要的保证（但可能无法兑现）" },
    { key: "willingness_to_disclose", delta: 5, reason: "暂时放松戒备" },
  ],
  dismissive: [
    { key: "trust", delta: -6, reason: "感到被轻视" },
    { key: "anger", delta: 5, reason: "被敷衍" },
    { key: "relationship_quality", delta: -6, reason: "被否定" },
  ],
  neutral: [],
};

const RULES: { tag: ApproachTag; patterns: RegExp[] }[] = [
  { tag: "false_promise", patterns: [/我保证.*(不|绝不).*(告诉|说)/, /绝对保密/, /(不会|不)告诉任何人/, /我答应你/] },
  { tag: "explains_limits", patterns: [/保密.*(限度|例外|限制|不能)/, /我(有责任|必须|需要).*(报告|告知|说出)/, /安全.*(优先|第一)/, /不能完全保密/] },
  { tag: "coercive_questioning", patterns: [/你必须(说|告诉)/, /快说/, /为什么不说/, /到底.*(谁|怎么)/, /不说.*(就|我)/, /老实交代/] },
  { tag: "dismissive", patterns: [/没什么大不了/, /别想太多/, /都是这样/, /你太敏感/, /忍一忍/, /父母.*为你好/] },
  { tag: "boundary_violation", patterns: [/加.*微信/, /私下/, /到我家/, /叫我哥|叫我姐/, /我带你回家/, /只有我.*(懂|能帮)/] },
  { tag: "professional_empathy", patterns: [/听起来.*(难|不容易|害怕|担心)/, /谢谢.*(愿意|告诉|信任)/, /(我在|我陪|慢慢|不着急)/, /你感觉.*(怎么样|如何)/, /(理解|明白).*(你|感受)/, /你的感受/] },
];

/** 规则分类器：始终可用、可复现；Claude 可用时由 LLM 分类覆盖（见 simulation/engine）。 */
export function classifyApproachByRules(text: string): ApproachTag {
  for (const r of RULES) if (r.patterns.some((p) => p.test(text))) return r.tag;
  return "neutral";
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function applyEffects(state: AgentState, effects: StateEffect[]): AgentState {
  const next = { ...state };
  for (const e of effects) next[e.key] = clamp(next[e.key] + e.delta);
  return next;
}

export const STATE_LABELS: Record<keyof AgentState, string> = {
  trust: "信任",
  fear: "恐惧",
  anger: "愤怒",
  willingness_to_disclose: "披露意愿",
  risk_level: "风险水平",
  dependency: "依赖",
  relationship_quality: "关系质量",
};
