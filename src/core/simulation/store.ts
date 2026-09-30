import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Session } from "../schemas";
import type { D1Database } from "./d1";

/**
 * 会话存储接口。Cloudflare 上使用 D1（绑定名 DB）；本地开发无绑定时退回进程内存。
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

/** 取 D1 绑定；不在 Workers 运行时（本地 next dev / 测试）返回 undefined。 */
export function getDB(): D1Database | undefined {
  try {
    return (getCloudflareContext().env as { DB?: D1Database }).DB;
  } catch {
    return undefined;
  }
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
