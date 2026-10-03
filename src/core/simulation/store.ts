import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Session } from "../schemas";
import type { D1Database } from "./d1";
import { openSqlite } from "./sqlite";

/**
 * 会话存储接口。Cloudflare 用 D1，自托管用 SQLite，本地开发退回进程内存。
 * 后续换 PostgreSQL 只需新增实现，不影响 Engine。
 */
export interface SessionStore {
  get(id: string): Promise<Session | undefined>;
  set(s: Session): Promise<void>;
}

const g = globalThis as unknown as { __swSessions?: Map<string, Session> };
const map = (g.__swSessions ??= new Map<string, Session>());

const memoryStore: SessionStore = {
  get: async (id) => map.get(id),
  set: async (s) => void map.set(s.session_id, s),
};

/**
 * 取数据库：Cloudflare 上用 D1 绑定；自托管服务器设置 SQLITE_PATH 后用本地 SQLite；
 * 两者都没有（本地 next dev / 测试）返回 undefined，退回进程内存。
 */
export function getDB(): D1Database | undefined {
  try {
    const d1 = (getCloudflareContext().env as { DB?: D1Database }).DB;
    if (d1) return d1;
  } catch {
    /* 不在 Workers 运行时 */
  }
  const file = process.env.SQLITE_PATH;
  return file ? openSqlite(file) : undefined;
}

export function getSessionStore(): SessionStore {
  const db = getDB();
  if (!db) return memoryStore;
  return {
    async get(id) {
      const row = await db.prepare("SELECT data FROM sessions WHERE session_id = ?").bind(id).first<{ data: string }>();
      return row ? (JSON.parse(row.data) as Session) : undefined;
    },
    async set(s) {
      await db
        .prepare(
          "INSERT INTO sessions (session_id, case_id, data, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5) " +
            "ON CONFLICT(session_id) DO UPDATE SET data = ?3, updated_at = ?5",
        )
        .bind(s.session_id, s.case_id, JSON.stringify(s), s.created_at, new Date().toISOString())
        .run();
    },
  };
}
