"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";

type State = Record<string, number>;
interface View {
  session_id: string;
  title: string;
  scene: string;
  client_name: string;
  transcript: { turn: number; speaker: "worker" | "client" | "system"; text: string }[];
  state: State;
  state_labels: Record<string, string>;
  finished: boolean;
  decision_gate: null | { available: boolean; turns_since_node: number; min_turns: number; low_disclosure: boolean };
  decision: null | {
    node_id: string;
    narration: string;
    prompt: string;
    low_disclosure: boolean;
    options: { id: string; label: string; description: string }[];
  };
  hitl_notice: string;
  suggested_prompts: string[];
  progress: { node_index: number; total_nodes: number };
  human_in_the_loop_required: boolean;
  provider?: string;
}
interface Result {
  chosen: string;
  outcome: string;
  protects: string[];
  sacrifices: string[];
  consequences: string[];
  value_conflicts: { a: string; b: string; note: string }[];
}

export default function Simulation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [view, setView] = useState<View | null>(null);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [rationale, setRationale] = useState("");
  const [open, setOpen] = useState(false);
  const [recap, setRecap] = useState<string | null>(null);
  const [recapLoading, setRecapLoading] = useState(false);
  const [showState, setShowState] = useState(true);
  const started = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (window.innerWidth < 768) setShowState(false);
    fetch("/api/sessions", { method: "POST", body: JSON.stringify({ case_id: id }) })
      .then((r) => r.json())
      .then((v) => (v.error ? setError(v.error) : setView(v)));
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [view?.transcript.length, result]);

  async function call(path: string, body: unknown) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/sessions/${view!.session_id}/${path}`, { method: "POST", body: JSON.stringify(body) });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!text.trim() || busy || !view) return;
    const t = text;
    setText("");
    const data = await call("message", { text: t });
    if (data) setView(data);
    else setText(t);
  }

  async function enterDecision() {
    setOpen(true);
    setRecap(null);
    setRecapLoading(true);
    try {
      const r = await fetch(`/api/sessions/${view!.session_id}/context`);
      const d = await r.json();
      setRecap(d.recap ?? null);
    } catch {
      setRecap(null);
    } finally {
      setRecapLoading(false);
    }
  }

  async function choose(optionId: string) {
    const data = await call("decision", { option_id: optionId, rationale });
    if (data) {
      setOpen(false);
      setResult(data.result);
      setLabels(data.principle_labels);
      setView(data);
      setRationale("");
    }
  }

  if (error && !view) return <main className="p-12">{error}</main>;
  if (!view) return <main className="p-12 text-[var(--muted)]">正在准备情境…</main>;

  const decisionOpen = view.decision && open && !result;
  const gate = view.decision_gate;

  return (
    <main className="min-h-dvh flex flex-col md:flex-row">
      <section className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-12 py-6 md:py-12 pb-72 md:pb-96">
        <Link href="/cases" className="sans text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← 退出情境
        </Link>
        <h1 className="text-2xl md:text-3xl font-light mt-4 md:mt-6">{view.title}</h1>
        {view.human_in_the_loop_required && (
          <p className="sans text-sm mt-4 border border-[var(--line)] p-3 text-[var(--muted)]">
            {view.hitl_notice}
          </p>
        )}
        <p className="mt-6 md:mt-8 text-[var(--muted)] italic fade-in">{view.scene}</p>

        <div className="mt-6 md:mt-8 space-y-5 md:space-y-6">
          {view.transcript.map((m, i) =>
            m.speaker === "system" ? (
              <p key={i} className="text-[var(--muted)] italic border-l-2 border-[var(--accent)] pl-4 fade-in">
                {m.text}
              </p>
            ) : (
              <div key={i} className={`fade-in ${m.speaker === "worker" ? "text-right" : ""}`}>
                <div className="sans text-sm text-[var(--muted)] mb-1">{m.speaker === "worker" ? "你（社工）" : view.client_name}</div>
                <p className={m.speaker === "worker" ? "text-[var(--accent)]" : ""}>{m.text}</p>
              </div>
            ),
          )}
          {busy && <p className="text-[var(--muted)] fade-in">……</p>}

          {result && (
            <div className="border border-[var(--line)] bg-[var(--panel)] p-4 md:p-6 fade-in sans text-base space-y-4">
              <div className="text-[var(--muted)]">你的选择：{result.chosen}</div>
              <div>
                <span className="text-[var(--muted)]">保护了：</span>
                {result.protects.map((p) => labels[p]).join("、") || "—"}
                <br />
                <span className="text-[var(--muted)]">承担代价：</span>
                {result.sacrifices.map((p) => labels[p]).join("、") || "—"}
              </div>
              {result.value_conflicts.length > 0 && (
                <div>
                  <div className="text-[var(--muted)] mb-1">涉及的价值冲突</div>
                  {result.value_conflicts.map((c, i) => (
                    <div key={i}>
                      {labels[c.a]} ⇄ {labels[c.b]}：{c.note}
                    </div>
                  ))}
                </div>
              )}
              <div>
                <div className="text-[var(--muted)] mb-1">可能的后果（不是预测，也不是评判）</div>
                <ul className="list-disc pl-5">
                  {result.consequences.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                {view.finished ? (
                  <Link href={`/reflection/${view.session_id}`} className="btn">
                    查看伦理反思报告 →
                  </Link>
                ) : (
                  <button className="btn" onClick={() => setResult(null)}>
                    继续
                  </button>
                )}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </section>

      <aside className="sans order-first md:order-last sticky top-0 z-20 md:w-80 md:h-dvh border-b md:border-b-0 md:border-l border-[var(--line)] px-4 py-3 md:p-6 text-base bg-[var(--panel)] max-h-[60dvh] md:max-h-none overflow-auto">
        <button className="text-sm text-[var(--muted)] md:mb-4 w-full text-left py-1" onClick={() => setShowState(!showState)}>
          {showState ? "▾" : "▸"} 服务对象状态（教学观察）
        </button>
        {showState && (
          <div className="grid grid-cols-2 gap-x-4 md:block mt-2 md:mt-0">
            {Object.entries(view.state).map(([k, v]) => (
            <div key={k} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{view.state_labels[k]}</span>
                <span className="text-[var(--muted)]">{v}</span>
              </div>
              <div className="h-1 bg-[var(--line)] mt-1">
                <div className="h-1 bg-[var(--accent)] transition-all duration-700" style={{ width: `${v}%` }} />
              </div>
            </div>
            ))}
          </div>
        )}
        {showState && (
          <p className="text-sm text-[var(--muted)] mt-2 md:mt-6 leading-relaxed">
            状态由你的言行按可解释规则改变，是模拟中的假设，不是对真实人的判断。
          </p>
        )}
        <p className="text-sm text-[var(--muted)] mt-2 md:mt-4">
          决策进度 {view.progress.node_index}/{view.progress.total_nodes}
        </p>
      </aside>

      {/* 决策层 */}
      {decisionOpen && view.decision && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 z-30 fade-in">
          <div className="max-w-2xl w-full bg-[var(--panel)] border border-[var(--line)] p-5 md:p-8 max-h-[92dvh] overflow-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {(recapLoading || recap) && (
              <div className="sans text-sm border border-[var(--line)] bg-[var(--bg)] p-3 mb-4">
                <div className="text-[var(--muted)] mb-1">到目前为止（根据你们的对话回顾，仅供参考）</div>
                {recapLoading ? <span className="text-[var(--muted)]">正在回顾……</span> : recap}
              </div>
            )}
            {view.decision.low_disclosure && (
              <p className="sans text-sm text-[var(--muted)] mb-3">
                提示：对方还没有把情况说完整。你可以现在就作决定，也可以先回去再聊一聊。
              </p>
            )}
            <p className="text-[var(--muted)] italic mb-4">{view.decision.narration}</p>
            <h3 className="text-lg md:text-xl mb-4 md:mb-6">{view.decision.prompt}</h3>
            <div className="space-y-3">
              {view.decision.options.map((o) => (
                <button
                  key={o.id}
                  disabled={busy}
                  onClick={() => choose(o.id)}
                  className="btn w-full text-left block"
                >
                  <div className="text-[var(--text)]">{o.label}</div>
                  <div className="text-sm text-[var(--muted)] mt-1">{o.description}</div>
                </button>
              ))}
            </div>
            <textarea
              className="sans w-full mt-6 bg-transparent border border-[var(--line)] p-3 text-base"
              rows={2}
              placeholder="（可选）写下你做这个选择的理由，它会出现在最终反思里"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
            <button className="sans text-sm text-[var(--accent)] mt-4" onClick={() => setOpen(false)}>
              ← 回去再聊一聊
            </button>
          </div>
        </div>
      )}

      {/* 输入 */}
      {!view.finished && !result && (
        <div className="fixed bottom-0 left-0 right-0 md:right-80 z-10 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent pt-6 md:pt-10 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-6 px-3 md:px-6">
          <div className="max-w-4xl mx-auto">
            {error && <p className="sans text-sm text-red-600 mb-2">{error}</p>}
            {gate && (
              <div className="sans mb-3 flex items-center justify-between gap-3 border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm">
                {gate.available ? (
                  <>
                    <span className="text-[var(--muted)]">你可以继续聊，也可以在自己觉得合适的时候作出决定。</span>
                    <button className="btn shrink-0" onClick={enterDecision}>
                      进入决策
                    </button>
                  </>
                ) : (
                  <span className="text-[var(--muted)]">
                    先和{view.client_name}聊聊吧，不用着急。（交流 {gate.turns_since_node}/{gate.min_turns} 轮后，可以选择进入决策）
                  </span>
                )}
              </div>
            )}
            <div className="flex gap-2 mb-2 md:mb-3 overflow-x-auto md:flex-wrap pb-1 -mx-1 px-1">
              {view.suggested_prompts.map((q) => (
                <button key={q} className="sans text-sm shrink-0 whitespace-nowrap bg-[var(--panel)] border border-[var(--line)] px-3 py-1 text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]" onClick={() => setText(q)}>
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2 md:gap-3 items-end">
              <textarea
                className="sans flex-1 min-w-0 bg-[var(--panel)] border border-[var(--line)] p-3 md:p-4 text-base md:text-lg leading-relaxed focus:outline-none focus:border-[var(--accent)]"
                rows={2}
                placeholder={`对${view.client_name}说点什么…`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button className="btn h-12 md:h-14 px-4 md:px-8 shrink-0" disabled={busy || !text.trim()} onClick={send}>
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
