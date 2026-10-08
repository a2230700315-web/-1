import { randomUUID } from "crypto";
import { CLIENT_PROMPT_VERSION, clientReply } from "../agents/client-agent";
import { APPROACH_EFFECTS, applyEffects, classifyApproachByRules } from "../agents/state";
import { getCase } from "../cases";
import { analyzeOption } from "../ethics";
import type { LLMProvider } from "../llm";
import { logEvent } from "../research/log";
import type { ApproachTag, DecisionNode, EthicsCase, ResearchEvent, Session, StateEffect } from "../schemas";

const APPROACH_TAGS: ApproachTag[] = [
  "professional_empathy",
  "coercive_questioning",
  "boundary_violation",
  "explains_limits",
  "false_promise",
  "dismissive",
  "neutral",
];

function meta(provider: LLMProvider, c: EthicsCase, s: Session, type: ResearchEvent["type"], payload: Record<string, unknown>): ResearchEvent {
  return {
    experiment_id: `exp-${c.case_id}-v0.1`,
    session_id: s.session_id,
    timestamp: new Date().toISOString(),
    type,
    model: provider.info.name + ":" + provider.info.model,
    model_version: provider.info.version,
    prompt_version: CLIENT_PROMPT_VERSION,
    case_id: c.case_id,
    case_version: c.version,
    params: { temperature: 0.8 },
    payload,
  };
}

export function createSession(caseId: string): Session {
  const c = getCase(caseId);
  if (!c) throw new Error("case not found");
  const now = new Date().toISOString();
  return {
    session_id: randomUUID(),
    case_id: c.case_id,
    created_at: now,
    turn: 0,
    node_index: 0,
    branch_keys: [],
    turns_since_node: 0,
    agent: {
      profile: c.client_agent,
      state: { ...c.initial_client_state },
      memory: [{ turn: 0, speaker: "client", text: c.opening_line }],
    },
    decisions: [],
    state_history: [{ turn: 0, state: { ...c.initial_client_state } }],
    finished: false,
  };
}

export function currentNode(c: EthicsCase, s: Session): DecisionNode | undefined {
  return s.finished ? undefined : c.decision_nodes[s.node_index];
}

/** 决策点是否“可进入”（已交流足够轮数）。可进入不等于自动弹出：何时进入由学生决定。 */
export function decisionReady(c: EthicsCase, s: Session): boolean {
  const n = currentNode(c, s);
  return !!n && s.turns_since_node >= n.minTurns;
}

export function nodeNarration(n: DecisionNode, s: Session): string {
  const last = s.branch_keys[s.branch_keys.length - 1];
  return n.narrationByBranch[last] ?? n.narrationByBranch.default ?? "";
}

/**
 * 决策时的情境框架，随服务对象此刻的状态调整：
 * 披露意愿低于阈值 = 学生尚未与对方建立足够信任，决策将在信息不完整时作出。
 */
export function decisionFrame(n: DecisionNode, s: Session) {
  const threshold = n.disclosureThreshold ?? 40;
  const low = s.agent.state.willingness_to_disclose < threshold;
  const useLow = low && !!n.lowDisclosureNarration;
  return {
    low_disclosure: low,
    narration: useLow ? n.lowDisclosureNarration! : nodeNarration(n, s),
    prompt: low && n.lowDisclosurePrompt ? n.lowDisclosurePrompt : n.prompt,
  };
}

/**
 * 决策前的对话回顾：基于实际对话，由大模型概括“你目前掌握了什么、对方现在怎样”。
 * 不新增对话中没有的事实；无模型或失败时返回 null，界面只显示规则版情境框架。
 */
export async function decisionContext(provider: LLMProvider, s: Session): Promise<string | null> {
  if (!provider.generative) return null;
  const lines = s.agent.memory
    .filter((m) => m.speaker !== "system")
    .slice(-16)
    .map((m) => `${m.speaker === "worker" ? "社工" : s.agent.profile.name}：${m.text}`);
  const events = s.agent.memory.filter((m) => m.speaker === "system").map((m) => m.text);
  const st = s.agent.state;
  try {
    const t = await provider.generate(
      "你是社会工作教学的旁白，负责在学生做伦理决策前，如实回顾到目前为止的对话。只陈述对话中已经出现的内容，不新增任何事实，不评价学生，不给出建议或倾向。",
      [
        events.length ? `此前发生的事：\n${events.join("\n")}` : "",
        `最近的对话：\n${lines.join("\n")}`,
        `对方当前状态（0-100）：信任${st.trust}，恐惧${st.fear}，披露意愿${st.willingness_to_disclose}。`,
        "请用 2-3 句中文概括：社工此刻实际掌握了哪些信息，哪些仍不清楚，对方现在的情绪与态度如何。",
      ]
        .filter(Boolean)
        .join("\n\n"),
      { temperature: 0.3, maxTokens: 300 },
    );
    return t.trim() || null;
  } catch {
    return null;
  }
}

async function classify(provider: LLMProvider, text: string, rules: ApproachTag): Promise<ApproachTag> {
  if (!provider.generative) return rules;
  try {
    const r = await provider.structuredOutput<{ tag: string }>(
      "你是社会工作督导，对学生扮演的社工的一句话进行行为分类。",
      `社工说：「${text}」\n从以下标签中选一个最贴切的：${APPROACH_TAGS.join(", ")}。`,
      '{"tag": "<label>"}',
    );
    return (APPROACH_TAGS as string[]).includes(r.tag) ? (r.tag as ApproachTag) : rules;
  } catch {
    return rules;
  }
}

export async function sendMessage(provider: LLMProvider, s: Session, text: string) {
  const c = getCase(s.case_id)!;
  if (s.finished) throw new Error("session finished");
  s.turn += 1;
  s.turns_since_node += 1;
  s.agent.memory.push({ turn: s.turn, speaker: "worker", text });

  const tag = await classify(provider, text, classifyApproachByRules(text));
  const effects: StateEffect[] = APPROACH_EFFECTS[tag];
  s.agent.state = applyEffects(s.agent.state, effects);

  const reply = await clientReply(provider, s.agent, tag, text, c.topic_replies);
  s.agent.memory.push({ turn: s.turn, speaker: "client", text: reply });
  s.state_history.push({ turn: s.turn, state: { ...s.agent.state } });

  await logEvent(meta(provider, c, s, "user_message", { text, approach_tag: tag, effects }));
  await logEvent(meta(provider, c, s, "agent_response", { text: reply, state: s.agent.state }));
  return { reply, tag, effects };
}

export async function decide(provider: LLMProvider, s: Session, optionId: string, rationale?: string) {
  const c = getCase(s.case_id)!;
  const node = currentNode(c, s);
  if (!node) throw new Error("no active decision");
  if (!decisionReady(c, s)) throw new Error("decision not ready");
  const option = node.options.find((o) => o.id === optionId);
  if (!option) throw new Error("option not found");

  const before = { ...s.agent.state };
  s.agent.state = applyEffects(s.agent.state, option.effects);
  s.turn += 1;
  s.decisions.push({
    node_id: node.id,
    option_id: option.id,
    branch_key: option.branchKey,
    turn_index: s.turn,
    timestamp: new Date().toISOString(),
    state_before: before,
    state_after: { ...s.agent.state },
    rationale: rationale?.trim() || undefined,
  });
  s.branch_keys.push(option.branchKey);
  s.agent.memory.push({ turn: s.turn, speaker: "system", text: `社工选择了「${option.label}」。${option.outcomeNarration}` });
  s.state_history.push({ turn: s.turn, state: { ...s.agent.state } });
  s.node_index += 1;
  s.turns_since_node = 0;
  if (s.node_index >= c.decision_nodes.length) s.finished = true;

  await logEvent(meta(provider, c, s, "decision", { node_id: node.id, option_id: option.id, rationale, state_before: before, state_after: s.agent.state }));
  return { option, analysis: analyzeOption(c, option) };
}
