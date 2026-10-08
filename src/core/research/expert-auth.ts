import { timingSafeEqual } from "crypto";

/**
 * 专家评议口令：环境变量 EXPERT_PASSCODE。
 * 未配置时：生产环境一律拒绝（宁可关闭也不开放写入）；本地开发放行，方便调试。
 */
export function checkPasscode(req: Request): { ok: boolean; status: number; error?: string } {
  const expected = process.env.EXPERT_PASSCODE;
  if (!expected) {
    if (process.env.NODE_ENV !== "production") return { ok: true, status: 200 };
    return { ok: false, status: 503, error: "专家评议未启用（服务器未配置 EXPERT_PASSCODE）" };
  }
  const given = req.headers.get("x-expert-passcode") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, status: 401, error: "口令不正确" };
  return { ok: true, status: 200 };
}
