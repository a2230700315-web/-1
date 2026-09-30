import { NextResponse } from "next/server";
import { listCases, toPublicSummary } from "@/core/cases";

export async function GET() {
  return NextResponse.json({ cases: listCases().map(toPublicSummary) });
}
