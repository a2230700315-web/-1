import { NextResponse } from "next/server";
import { checkPasscode } from "@/core/research/expert-auth";
import { listReviews, sanitizeReview, saveReview } from "@/core/research/reviews";

export async function GET(req: Request) {
  const auth = checkPasscode(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const u = new URL(req.url);
  const reviews = await listReviews({ case_id: u.searchParams.get("case_id") ?? undefined, reviewer_code: u.searchParams.get("reviewer_code") ?? undefined });
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const auth = checkPasscode(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const parsed = sanitizeReview(await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const saved = await saveReview(parsed.value);
  return NextResponse.json({ review: saved });
}
