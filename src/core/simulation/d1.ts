/** 只声明用到的 D1 接口，避免引入整套 Workers 全局类型与 DOM 类型冲突。 */
export interface D1Database {
  prepare(sql: string): D1Statement;
}
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
  all<T = unknown>(): Promise<{ results: T[] }>;
}
