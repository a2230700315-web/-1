import type { ResearchEvent } from "../schemas";
import { getDB } from "../simulation/store";

/**
 * Research Mode 的最小实现：记录足以复现实验的元数据。
 * Cloudflare：写入 D1 research_events 表；本地：追加写 data/research-log.jsonl。
 * 仅含合成数据；未来接入真实数据前必须先完成数据治理设计。日志失败不中断模拟。
 */
export async function logEvent(e: ResearchEvent): Promise<void> {
  try {
    const db = getDB();
    if (db) {
      await db
        .prepare(
          "INSERT INTO research_events (experiment_id, session_id, timestamp, type, model, model_version, prompt_version, case_id, case_version, params, payload) " +
            "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
        )
        .bind(e.experiment_id, e.session_id, e.timestamp, e.type, e.model, e.model_version, e.prompt_version, e.case_id, e.case_version, JSON.stringify(e.params), JSON.stringify(e.payload))
        .run();
      return;
    }
    const { appendFile, mkdir } = await import("fs/promises");
    const dir = `${process.cwd()}/data`;
    await mkdir(dir, { recursive: true });
    await appendFile(`${dir}/research-log.jsonl`, JSON.stringify(e) + "\n", "utf8");
  } catch {
    /* ignore */
  }
}
