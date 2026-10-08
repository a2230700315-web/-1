import type { D1Database, D1Statement } from "./d1";

/**
 * 自托管（Node 服务器）用的本地 SQLite，适配成与 D1 相同的最小接口。
 * 使用 Node 内置 node:sqlite，不引入依赖；仅当设置了 SQLITE_PATH 时才会被加载。
 * 通过 process.getBuiltinModule 同步取得内置模块，避免被打包器静态解析
 * （Cloudflare Workers 构建中不会包含该模块）。
 */
type Builtin = (id: string) => any;

function builtin(id: string): any {
  const get = (process as unknown as { getBuiltinModule?: Builtin }).getBuiltinModule;
  if (!get) throw new Error("需要 Node >= 22.3（推荐 24）才能使用 SQLITE_PATH");
  return get(id);
}

const g = globalThis as unknown as { __swSqlite?: D1Database };

export function openSqlite(file: string): D1Database {
  if (g.__swSqlite) return g.__swSqlite;
  const { DatabaseSync } = builtin("node:sqlite");
  const fs = builtin("node:fs");
  const path = builtin("node:path");

  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL;");
  // 与 Cloudflare D1 共用同一份建表脚本
  const dir = path.join(process.cwd(), "migrations");
  for (const f of fs.readdirSync(dir).filter((n: string) => n.endsWith(".sql")).sort()) {
    db.exec(fs.readFileSync(path.join(dir, f), "utf8"));
  }

  const wrap = (sql: string, params: unknown[] = []): D1Statement => ({
    bind: (...values) => wrap(sql, values),
    first: async <T>() => ((db.prepare(sql).get(...params) as T | undefined) ?? null),
    run: async () => db.prepare(sql).run(...params),
    all: async <T>() => ({ results: db.prepare(sql).all(...params) as T[] }),
  });
  g.__swSqlite = { prepare: (sql: string) => wrap(sql) };
  return g.__swSqlite;
}
