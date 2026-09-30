import { NextResponse } from "next/server";
import { getProvider } from "@/core/llm";
import { decide } from "@/core/simulation/engine";
import { getSessionStore } from "@/core/simulation/store";
import { sessionView, principleLabels } from "@/core/simulation/view";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const s = await getSessionStore().get(id);
  if (!s) return NextResponse.json({ error: "session not found" }, { status: 404 });
  const { option_id, rationale } = (await req.json().catch(() => ({}))) as { option_id?: string; rationale?: string };
  try {
    const r = await decide(getProvider(), s, option_id ?? "", rationale?.slice(0, 1000));
    await getSessionStore().set(s);
    return NextResponse.json({
      ...sessionView(s),
      result: {
        chosen: r.option.label,
        outcome: r.option.outcomeNarration,
        protects: r.option.protects,
        sacrifices: r.option.sacrifices,
        consequences: r.option.consequences,
        value_conflicts: r.analysis.value_conflicts,
        effects: r.option.effects,
      },
      principle_labels: principleLabels(),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
