import { checkPasscode } from "@/core/research/expert-auth";
import { listReviews } from "@/core/research/reviews";
import { REVIEW_DIMENSIONS } from "@/core/schemas";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

/** 导出 CSV（UTF-8 带 BOM，Excel 可直接打开）。可加 ?format=json。 */
export async function GET(req: Request) {
  const auth = checkPasscode(req);
  if (!auth.ok) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers: { "content-type": "application/json" } });
  const reviews = await listReviews();
  if (new URL(req.url).searchParams.get("format") === "json") return Response.json({ reviews });
  const head = ["review_id", "created_at", "reviewer_code", "reviewer_background", "target_type", "case_id", "case_version", "target_ref", ...REVIEW_DIMENSIONS.map((d) => d.key), "comment"];
  const rows = reviews.map((r) =>
    [r.review_id, r.created_at, r.reviewer_code, r.reviewer_background, r.target_type, r.case_id, r.case_version, r.target_ref, ...REVIEW_DIMENSIONS.map((d) => r.ratings[d.key] ?? ""), r.comment].map(esc).join(","),
  );
  return new Response("\ufeff" + [head.join(","), ...rows].join("\r\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="expert-reviews.csv"' },
  });
}
