import type { ChatMessage, GenerationParams, LLMProvider, ProviderInfo } from "./types";

/** 豆包（火山方舟 Ark，OpenAI 兼容接口）。model 为方舟推理接入点 ID（ep-...）。仅依赖 fetch。 */
export class DoubaoProvider implements LLMProvider {
  readonly info: ProviderInfo;
  readonly generative = true;
  constructor(
    private apiKey: string,
    model: string,
    private baseUrl = "https://ark.cn-beijing.volces.com/api/v3",
  ) {
    this.info = { name: "doubao", model, version: "ark-chat-completions-v3" };
  }

  async chat(system: string, messages: ChatMessage[], params: GenerationParams = {}): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.info.model,
        max_tokens: params.maxTokens ?? 800,
        temperature: params.temperature ?? 0.8,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    if (!res.ok) throw new Error(`Doubao API ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    return data.choices[0]?.message?.content ?? "";
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
