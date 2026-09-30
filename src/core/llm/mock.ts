import type { LLMProvider, ProviderInfo } from "./types";

/**
 * 离线 Provider：无 API Key 时让整个流程可运行、可测试。
 * 不具备生成能力；调用方检测 generative=false 后使用确定性兜底。
 */
export class MockProvider implements LLMProvider {
  readonly info: ProviderInfo = { name: "mock", model: "mock-1", version: "0" };
  readonly generative = false;
  async chat(): Promise<string> {
    throw new Error("mock provider has no generative capability");
  }
  async generate(): Promise<string> {
    throw new Error("mock provider has no generative capability");
  }
  async structuredOutput<T>(): Promise<T> {
    throw new Error("mock provider has no generative capability");
  }
}
