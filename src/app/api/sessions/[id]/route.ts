import { NextResponse } from "next/server";
import { getSessionStore } from "@/core/simulation/store";
import { sessionView } from "@/core/simulation/view";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const s = await getSessionStore().get(id);
  if (!s) return NextResponse.json({ error: "session not found（服务重启后会话会丢失）" }, { status: 404 });
  return NextResponse.json(sessionView(s));
}
