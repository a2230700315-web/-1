import { NextResponse } from "next/server";
import { getProvider } from "@/core/llm";
import { sendMessage } from "@/core/simulation/engine";
import { getSessionStore } from "@/core/simulation/store";
import { sessionView } from "@/core/simulation/view";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const s = await getSessionStore().get(id);
  if (!s) return NextResponse.json({ error: "session not found" }, { status: 404 });
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text || !text.trim() || text.length > 1000) return NextResponse.json({ error: "invalid text" }, { status: 400 });
  try {
    const r = await sendMessage(getProvider(), s, text.trim());
    await getSessionStore().set(s);
    return NextResponse.json({ ...sessionView(s), last: r });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
