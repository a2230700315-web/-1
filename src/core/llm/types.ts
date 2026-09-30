/** LLM Provider Interface —— Agent/Engine 只依赖此接口，不依赖任何厂商。 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GenerationParams {
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderInfo {
  name: string;
  model: string;
  version: string;
}

export interface LLMProvider {
  readonly info: ProviderInfo;
  /** 是否具备生成能力（Mock 为 false，调用方据此走确定性兜底） */
  readonly generative: boolean;
  chat(system: string, messages: ChatMessage[], params?: GenerationParams): Promise<string>;
  generate(system: string, prompt: string, params?: GenerationParams): Promise<string>;
  /** 返回解析后的 JSON；失败抛错，由调用方降级。 */
  structuredOutput<T>(system: string, prompt: string, schemaHint: string, params?: GenerationParams): Promise<T>;
  // embed() / evaluate() 预留：随 Knowledge / Evaluation Engine 在 V0.2 加入
}

/** 任务路由预留：V0.1 全部走同一个 Provider。 */
export type TaskKind = "simple_generation" | "conversation" | "complex_reasoning" | "evaluation" | "safety_review";
