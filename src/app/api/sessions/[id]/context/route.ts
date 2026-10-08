import { NextResponse } from "next/server";
import { getProvider } from "@/core/llm";
import { decisionContext } from "@/core/simulation/engine";
import { getSessionStore } from "@/core/simulation/store";

/** 学生点击“进入决策”时调用：返回基于实际对话的回顾（无模型时为 null）。 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const s = await getSessionStore().get(id);
  if (!s) return NextResponse.json({ error: "session not found" }, { status: 404 });
  return NextResponse.json({ recap: await decisionContext(getProvider(), s) });
}
