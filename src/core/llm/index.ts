import { ClaudeProvider } from "./claude";
import { DoubaoProvider } from "./doubao";
import { MockProvider } from "./mock";
import type { LLMProvider } from "./types";

export * from "./types";

/**
 * 唯一的 Provider 装配点。可用 LLM_PROVIDER=doubao|claude|mock 显式指定；
 * 未指定时按已配置的 Key 自动选择（豆包优先），都没有则用 Mock。
 */
export function getProvider(): LLMProvider {
  const want = process.env.LLM_PROVIDER;
  const ark = process.env.ARK_API_KEY;
  const claude = process.env.ANTHROPIC_API_KEY;
  if (want !== "mock") {
    if (ark && (!want || want === "doubao")) {
      return new DoubaoProvider(ark, process.env.ARK_MODEL || "", process.env.ARK_BASE_URL || undefined);
    }
    if (claude && (!want || want === "claude")) {
      return new ClaudeProvider(claude, process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5");
    }
  }
  return new MockProvider();
}
