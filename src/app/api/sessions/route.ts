import { NextResponse } from "next/server";
import { getProvider } from "@/core/llm";
import { logEvent } from "@/core/research/log";
import { createSession } from "@/core/simulation/engine";
import { getSessionStore } from "@/core/simulation/store";
import { sessionView } from "@/core/simulation/view";

export async function POST(req: Request) {
  const { case_id } = (await req.json().catch(() => ({}))) as { case_id?: string };
  try {
    const s = createSession(case_id ?? "");
    await getSessionStore().set(s);
    const p = getProvider();
    await logEvent({
      experiment_id: `exp-${s.case_id}-v0.1`,
      session_id: s.session_id,
      timestamp: s.created_at,
      type: "session_start",
      model: `${p.info.name}:${p.info.model}`,
      model_version: p.info.version,
      prompt_version: "client-agent-v0.1",
      case_id: s.case_id,
      case_version: "0.1.0",
      params: {},
      payload: {},
    });
    return NextResponse.json({ ...sessionView(s), provider: p.info.name });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 404 });
  }
}
