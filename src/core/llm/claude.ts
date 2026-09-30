import type { ChatMessage, GenerationParams, LLMProvider, ProviderInfo } from "./types";

/** 仅依赖 fetch，不引入 SDK。 */
export class ClaudeProvider implements LLMProvider {
  readonly info: ProviderInfo;
  readonly generative = true;
  constructor(private apiKey: string, model: string) {
    this.info = { name: "claude", model, version: "anthropic-version:2023-06-01" };
  }

  async chat(system: string, messages: ChatMessage[], params: GenerationParams = {}): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.info.model,
        system,
        max_tokens: params.maxTokens ?? 800,
        temperature: params.temperature ?? 0.8,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { content: { type: string; text?: string }[] };
    return data.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("");
  }

  generate(system: string, prompt: string, params?: GenerationParams) {
    return this.chat(system, [{ role: "user", content: prompt }], params);
  }

  async structuredOutput<T>(system: string, prompt: string, schemaHint: string, params?: GenerationParams): Promise<T> {
    const text = await this.generate(
      system,
      `${prompt}\n\n只输出一个 JSON 对象，不要任何其他文字。JSON 结构：\n${schemaHint}`,
      { temperature: 0.2, ...params },
    );
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("No JSON in model output");
    return JSON.parse(m[0]) as T;
  }
}
