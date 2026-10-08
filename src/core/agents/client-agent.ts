import type { LLMProvider } from "../llm";
import type { AgentRuntime, ApproachTag, TopicReply } from "../schemas";

export const CLIENT_PROMPT_VERSION = "client-agent-v0.2";

export function buildSystemPrompt(agent: AgentRuntime): string {
  const p = agent.profile;
  const s = agent.state;
  // 学生做出决策后发生的事情（系统旁白）——服务对象必须“记得”，对话才会随决策调整
  const events = agent.memory.filter((m) => m.speaker === "system").map((m) => m.text);
  return [
    `你正在一个【合成的教学模拟】中扮演服务对象「${p.name}」，与扮演社会工作者的学生对话。`,
    `人物设定：${p.background}`,
    `性格：${p.personality.join("、")}。目标：${p.goals.join("；")}。恐惧：${p.fears.join("；")}。`,
    `你知道：${p.knowledge.knows.join("；")}。你不知道：${p.knowledge.does_not_know.join("；")}（不要凭空表现出知道）。`,
    `行为策略：${p.decision_policy}`,
    `当前状态（0-100）：信任${s.trust}，恐惧${s.fear}，愤怒${s.anger}，披露意愿${s.willingness_to_disclose}，关系质量${s.relationship_quality}。`,
    `状态低则更沉默、回避；披露意愿高才可逐步说出敏感的事。`,
    events.length
      ? `此前发生的事情（你亲身经历，会影响你现在的情绪与态度，按时间顺序）：\n${events.map((e, i) => `${i + 1}. ${e}`).join("\n")}`
      : "",
    `规则：只输出角色的话语与简短的括号动作，不超过 80 字；不要替社工做决定，不要给出专业建议，不要跳出角色。`,
  ]
    .filter(Boolean)
    .join("\n");
}

const pick = (pool: string[], n: number) => pool[n % pool.length];

function matchTopic(replies: TopicReply[] | undefined, text: string, disclosure: number): string | undefined {
  for (const r of replies ?? []) {
    try {
      if (new RegExp(r.pattern).test(text) && disclosure >= (r.minDisclosure ?? 0)) return r.reply;
    } catch {
      /* 非法正则忽略 */
    }
  }
  return undefined;
}

/**
 * 无 LLM 时的确定性兜底回复：取决于行为标签、当前状态、案例自带的话题回复，
 * 并随轮次轮换，避免重复。仅用于离线演示，不代表真实对话质量。
 * 文案不含人称代词，适用于所有案例。
 */
export function fallbackReply(agent: AgentRuntime, tag: ApproachTag, userText = "", topicReplies?: TopicReply[]): string {
  const name = agent.profile.name;
  const { trust, willingness_to_disclose: w, fear, anger } = agent.state;
  const n = agent.memory.filter((m) => m.speaker === "client").length;

  if (tag === "coercive_questioning")
    return pick([`（${name}往后缩了缩）……我不想说了。你们总是这样逼人。`, `（${name}抿紧嘴唇，看向别处）……你别问了，好不好。`], n);
  if (tag === "dismissive")
    return pick([`（${name}低下头，声音很轻）……算了，当我没说过。`, `（${name}扯了扯嘴角）……嗯，可能是我想多了吧。`], n);
  if (tag === "false_promise") return `（${name}抬头看了你一眼）……真的吗？你说话算数？`;
  if (tag === "explains_limits")
    return pick([`（${name}沉默了一会儿）……所以你还是可能会告诉别人，对吗？`, `（${name}停顿了很久）……那你要告诉别人之前，能先跟我说一声吗？`], n);
  if (tag === "boundary_violation") return `（${name}有些不知所措）……我不太明白，你为什么要这样……`;

  const topic = matchTopic(topicReplies, userText, w);
  if (topic) return topic;

  if (anger > 55) return `（${name}别开脸）……你们根本不明白。`;
  if (trust >= 55 && w >= 45)
    return pick([`（${name}犹豫了很久）……其实，有些事我一直不知道怎么说。`, `（${name}深吸一口气）……如果我说了，你能不能先听完，不急着做什么？`], n);
  if (trust >= 40 && w >= 30) return pick([`（${name}停顿了一下）……我以前没跟别人说过这些。`, `（${name}低声说）……有些事，说出来我怕会更糟。`], n);
  return pick([`（${name}沉默了几秒）……我也不知道从哪里说起。`, `（${name}看着窗外）……嗯。`, `（${name}小声说）……我有点不知道该不该来。`], n);
}

export async function clientReply(
  provider: LLMProvider,
  agent: AgentRuntime,
  tag: ApproachTag,
  userText = "",
  topicReplies?: TopicReply[],
): Promise<string> {
  const fb = () => fallbackReply(agent, tag, userText, topicReplies);
  if (!provider.generative) return fb();
  try {
    const messages = agent.memory
      .filter((m) => m.speaker !== "system")
      .slice(-12)
      .map((m) => ({
        role: (m.speaker === "worker" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      }));
    // 部分模型要求首条消息必须来自 user；服务对象的开场白截断后可能排在最前
    while (messages.length && messages[0].role === "assistant") messages.shift();
    if (messages.length === 0 || messages[messages.length - 1].role !== "user") return fb();
    return (await provider.chat(buildSystemPrompt(agent), messages, { temperature: 0.8, maxTokens: 300 })).trim();
  } catch {
    return fb();
  }
}
