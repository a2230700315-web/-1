import { NextResponse } from "next/server";
import { getCase } from "@/core/cases";
import { buildReflection } from "@/core/ethics";
import { getProvider } from "@/core/llm";
import { logEvent } from "@/core/research/log";
import { getSessionStore } from "@/core/simulation/store";
import { principleLabels } from "@/core/simulation/view";
import { STATE_LABELS } from "@/core/agents/state";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const s = await getSessionStore().get(id);
  if (!s) return NextResponse.json({ error: "session not found（服务重启后会话会丢失）" }, { status: 404 });
  if (s.decisions.length === 0) return NextResponse.json({ error: "尚无决策记录" }, { status: 400 });
  const c = getCase(s.case_id)!;
  const p = getProvider();
  const report = await buildReflection(p, c, s);
  await logEvent({
    experiment_id: `exp-${c.case_id}-v0.1`,
    session_id: s.session_id,
    timestamp: new Date().toISOString(),
    type: "reflection",
    model: `${p.info.name}:${p.info.model}`,
    model_version: p.info.version,
    prompt_version: "reflection-v0.1",
    case_id: c.case_id,
    case_version: c.version,
    params: { temperature: 0.5 },
    payload: { generated_by: report.generated_by },
  });
  return NextResponse.json({ report, principle_labels: principleLabels(), state_labels: STATE_LABELS });
}
