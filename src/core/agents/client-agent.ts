import type { LLMProvider } from "../llm";
import type { AgentRuntime, ApproachTag } from "../schemas";

export const CLIENT_PROMPT_VERSION = "client-agent-v0.1";

export function buildSystemPrompt(agent: AgentRuntime): string {
  const p = agent.profile;
  const s = agent.state;
  return [
    `你正在一个【合成的教学模拟】中扮演服务对象「${p.name}」，与扮演社会工作者的学生对话。`,
    `人物设定：${p.background}`,
    `性格：${p.personality.join("、")}。目标：${p.goals.join("；")}。恐惧：${p.fears.join("；")}。`,
    `你知道：${p.knowledge.knows.join("；")}。你不知道：${p.knowledge.does_not_know.join("；")}（不要凭空表现出知道）。`,
    `行为策略：${p.decision_policy}`,
    `当前状态（0-100）：信任${s.trust}，恐惧${s.fear}，愤怒${s.anger}，披露意愿${s.willingness_to_disclose}，关系质量${s.relationship_quality}。`,
    `状态低则更沉默、回避；披露意愿高才可逐步说出家里的事。`,
    `规则：只输出角色的话语与简短的括号动作，不超过 80 字；不要替社工做决定，不要给出专业建议，不要跳出角色。`,
  ].join("\n");
}

const pick = (pool: string[], n: number) => pool[n % pool.length];

/**
 * 无 LLM 时的确定性兜底回复：取决于行为标签、当前状态、用户话语中的话题词，
 * 并随轮次轮换，避免重复。它只是离线演示用，不代表真实对话质量。
 */
export function fallbackReply(agent: AgentRuntime, tag: ApproachTag, userText = ""): string {
  const { trust, willingness_to_disclose: w, fear, anger } = agent.state;
  const n = agent.memory.filter((m) => m.speaker === "client").length;

  if (tag === "coercive_questioning")
    return pick(["（他往后缩了缩）……我不想说了。你们大人都是这样。", "（他抿紧嘴唇，盯着地面）……你别问了，好不好。"], n);
  if (tag === "dismissive")
    return pick(["（他低下头，声音很轻）……算了，当我没说过。", "（他扯了扯嘴角）……嗯，可能是我想多了吧。"], n);
  if (tag === "false_promise") return "（他抬头看了你一眼）……真的吗？你说话算数？你不会告诉我爸妈，也不会告诉老师？";
  if (tag === "explains_limits")
    return pick(["（他攥紧了书包带）……所以你还是可能会告诉别人，对吗？", "（他沉默了很久）……那你告诉别人之前，能先跟我说吗？"], n);
  if (tag === "boundary_violation") return "（他有些不知所措）……我不太明白，你为什么要这样……";

  // 话题词：让回复对用户说的话有反应
  if (/爸|父亲/.test(userText))
    return w >= 40 ? "（他的手指僵了一下）……我爸他……喝了酒就会不一样。平时还好。" : "（他避开视线）……我爸……没什么，就是工作比较忙。";
  if (/妈|母亲/.test(userText)) return "（他轻声说）……我妈她……不太说话。我不想让她担心。";
  if (/家里|在家|回家/.test(userText))
    return trust >= 40 ? "（他停顿了一下）……有时候，回家我会有点怕。不过……也不是每天。" : "（他耸耸肩）……就那样吧，还好。";
  if (/伤|痕|淤青|疼|手臂|袖子/.test(userText))
    return w >= 45 ? "（他下意识拉了拉袖口）……是我自己不小心。……其实不是。" : "（他迅速把袖子拉下来）……没什么，撞到的。";
  if (/学校|成绩|同学|朋友|体育/.test(userText))
    return "（他低声说）……最近上课总是走神。同学问我怎么了，我也不知道怎么说。";
  if (/保密|告诉别人|隐私/.test(userText)) return "（他抬起头）……你们……会告诉别人吗？";
  if (/怎么样|感觉|心情/.test(userText))
    return fear > 55 ? "（他小声说）……有点累。也有点……不知道该不该来。" : "（他想了想）……比之前好一点。至少在这里，不用装。";

  if (anger > 55) return "（他别开脸）……你们根本不明白。";
  if (trust >= 55 && w >= 45)
    return pick(["（他犹豫了很久）……其实，家里有些事，我一直不知道怎么说。", "（他深吸一口气）……如果我说了，你能不能……先听完，不急着做什么？"], n);
  if (trust >= 40 && w >= 30)
    return pick(["（他停顿了一下）……有时候，回家我会有点怕。", "（他低声说）……我以前没跟别人说过这些。"], n);
  return pick(["（他沉默了几秒）……我也不知道从哪里说起。", "（他看着窗外）……嗯。", "（他小声说）……我有点不知道该不该来。"], n);
}

export async function clientReply(
  provider: LLMProvider,
  agent: AgentRuntime,
  tag: ApproachTag,
  userText = "",
): Promise<string> {
  if (!provider.generative) return fallbackReply(agent, tag, userText);
  try {
    const messages = agent.memory
      .filter((m) => m.speaker !== "system")
      .slice(-12)
      .map((m) => ({
        role: (m.speaker === "worker" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      }));
    if (messages.length === 0 || messages[messages.length - 1].role !== "user") return fallbackReply(agent, tag, userText);
    return (await provider.chat(buildSystemPrompt(agent), messages, { temperature: 0.8, maxTokens: 300 })).trim();
  } catch {
    return fallbackReply(agent, tag, userText);
  }
}
