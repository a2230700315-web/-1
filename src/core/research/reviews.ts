import { randomUUID } from "crypto";
import { getDB } from "../simulation/store";
import { REVIEW_DIMENSIONS, type ExpertReview, type ReviewTargetType } from "../schemas";

/** 评议存储：有数据库（D1 / SQLite）时落库，否则进程内存（仅本地开发）。 */
const g = globalThis as unknown as { __swReviews?: ExpertReview[] };
const mem = (g.__swReviews ??= []);

export interface ReviewInput {
  reviewer_code: string;
  reviewer_background?: string;
  target_type: ReviewTargetType;
  case_id: string;
  case_version: string;
  target_ref: string;
  ratings: Record<string, number>;
  comment?: string;
}

export function sanitizeReview(raw: unknown): { ok: true; value: ReviewInput } | { ok: false; error: string } {
  const r = raw as Partial<ReviewInput> | null;
  if (!r || typeof r !== "object") return { ok: false, error: "invalid body" };
  const code = String(r.reviewer_code ?? "").trim();
  if (!/^[A-Za-z0-9_-]{2,24}$/.test(code)) return { ok: false, error: "评议者编号需为 2-24 位字母、数字、-、_（请勿使用真实姓名）" };
  if (!["case", "option", "dialogue"].includes(String(r.target_type))) return { ok: false, error: "target_type 非法" };
  if (!r.case_id || !r.case_version || !r.target_ref) return { ok: false, error: "缺少 case_id / case_version / target_ref" };
  const allowed = new Set<string>(REVIEW_DIMENSIONS.map((d) => d.key));
  const ratings: Record<string, number> = {};
  for (const [k, v] of Object.entries(r.ratings ?? {})) {
    if (!allowed.has(k)) return { ok: false, error: `未知维度 ${k}` };
    if (!Number.isInteger(v) || v < 1 || v > 5) return { ok: false, error: `${k} 需为 1-5 的整数` };
    ratings[k] = v;
  }
  const comment = r.comment ? String(r.comment).slice(0, 2000) : undefined;
  if (!Object.keys(ratings).length && !comment) return { ok: false, error: "请至少打一个分或写一条意见" };
  return {
    ok: true,
    value: {
      reviewer_code: code,
      reviewer_background: r.reviewer_background ? String(r.reviewer_background).slice(0, 100) : undefined,
      target_type: r.target_type as ReviewTargetType,
      case_id: String(r.case_id).slice(0, 80),
      case_version: String(r.case_version).slice(0, 20),
      target_ref: String(r.target_ref).slice(0, 80),
      ratings,
      comment,
    },
  };
}

/** 同一评议者对同一对象只保留最新一条（可修改）。 */
export async function saveReview(input: ReviewInput): Promise<ExpertReview> {
  const rec: ExpertReview = { review_id: randomUUID(), created_at: new Date().toISOString(), ...input };
  const db = getDB();
  if (db) {
    await db
      .prepare(
        "INSERT INTO expert_reviews (review_id, created_at, reviewer_code, reviewer_background, target_type, case_id, case_version, target_ref, ratings, comment) " +
          "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10) " +
          "ON CONFLICT(reviewer_code, target_type, case_id, target_ref) DO UPDATE SET " +
          "review_id=?1, created_at=?2, reviewer_background=?4, case_version=?7, ratings=?9, comment=?10",
      )
      .bind(rec.review_id, rec.created_at, rec.reviewer_code, rec.reviewer_background ?? null, rec.target_type, rec.case_id, rec.case_version, rec.target_ref, JSON.stringify(rec.ratings), rec.comment ?? null)
      .run();
  } else {
    const i = mem.findIndex((x) => x.reviewer_code === rec.reviewer_code && x.target_type === rec.target_type && x.case_id === rec.case_id && x.target_ref === rec.target_ref);
    if (i >= 0) mem[i] = rec;
    else mem.push(rec);
  }
  return rec;
}

export async function listReviews(filter: { case_id?: string; reviewer_code?: string } = {}): Promise<ExpertReview[]> {
  const db = getDB();
  if (db) {
    const { results } = await db.prepare("SELECT * FROM expert_reviews ORDER BY id DESC").all<Record<string, string | null>>();
    return results
      .map((r) => ({ ...(r as object), ratings: JSON.parse(String(r.ratings)), comment: r.comment ?? undefined, reviewer_background: r.reviewer_background ?? undefined }) as unknown as ExpertReview)
      .filter((r) => (!filter.case_id || r.case_id === filter.case_id) && (!filter.reviewer_code || r.reviewer_code === filter.reviewer_code));
  }
  return mem.filter((r) => (!filter.case_id || r.case_id === filter.case_id) && (!filter.reviewer_code || r.reviewer_code === filter.reviewer_code));
}
