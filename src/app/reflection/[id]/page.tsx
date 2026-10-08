"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

interface Report {
  case_title: string;
  path: { node_prompt: string; chosen: string; protects: string[]; sacrifices: string[]; consequences: string[]; rationale?: string }[];
  value_profile: { principle: string; protected: number; sacrificed: number }[];
  state_trajectory: { turn: number; state: Record<string, number> }[];
  value_conflicts: { a: string; b: string; note: string }[];
  perspectives: { stance: string; argument: string }[];
  uncertainty: string[];
  reflection_questions: string[];
  transcript: { speaker: "worker" | "client" | "system"; text: string }[];
  client_name: string;
  created_at: string;
  narrative?: string;
  generated_by: string;
  disclaimer: string;
}

export default function Reflection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{ report: Report; principle_labels: Record<string, string>; state_labels: Record<string, string> } | null>(null);
  const [error, setError] = useState("");

  const [withLog, setWithLog] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch(`/api/sessions/${id}/reflection`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return setError(d.error);
        setData(d);
        document.title = `伦理反思报告-${d.report.case_title.replace(/[「」"“”]/g, "")}`;
      });
  }, [id]);

  if (error) return <main className="p-12">{error}<div className="mt-6"><Link href="/cases" className="btn">返回</Link></div></main>;
  if (!data) return <main className="p-12 text-[var(--muted)]">正在整理你的决策路径…</main>;
  const { report: r, principle_labels: L, state_labels: SL } = data;
  const first = r.state_trajectory[0]?.state ?? {};
  const last = r.state_trajectory[r.state_trajectory.length - 1]?.state ?? {};

  return (
    <main className="report max-w-4xl mx-auto px-5 md:px-6 py-8 md:py-16 space-y-10 md:space-y-14">
      <div className="no-print sans flex flex-wrap items-center gap-x-4 gap-y-2 border border-[var(--line)] bg-[var(--panel)] p-3 text-sm">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="姓名/学号（选填，仅用于这份 PDF，不会上传）" className="flex-1 min-w-[12rem] bg-[var(--bg)] border border-[var(--line)] p-2" />
        <label className="flex items-center gap-2 text-[var(--muted)]">
          <input type="checkbox" checked={withLog} onChange={(e) => setWithLog(e.target.checked)} />
          附上完整对话记录
        </label>
        <button className="btn" onClick={() => window.print()}>
          导出 PDF
        </button>
      </div>
      <p className="no-print sans text-sm text-[var(--muted)] -mt-6">点击后在打印窗口的“目标打印机”中选择“另存为 PDF”。手机上请选择“分享 / 打印 → 存储为 PDF”。</p>

      <header className="fade-in">
        {name && (
          <p className="sans text-sm text-[var(--muted)] mb-2">
            {name} · {new Date(r.created_at).toLocaleDateString("zh-CN")}
          </p>
        )}
        <p className="sans text-sm tracking-[0.3em] text-[var(--muted)] mb-4">ETHICAL REFLECTION</p>
        <h1 className="text-3xl font-light">{r.case_title}</h1>
        <p className="text-[var(--muted)] mt-3">这不是一份成绩单。它呈现的是你的选择背后，你重视什么、放下了什么。</p>
      </header>

      {r.narrative && (
        <section>
          <h2 className="text-xl mb-3">整体点评</h2>
          <p className="whitespace-pre-wrap">{r.narrative}</p>
          <p className="sans text-sm text-[var(--muted)] mt-2">由 {r.generated_by} 生成，仅供反思参考。</p>
        </section>
      )}

      <section>
        <h2 className="text-xl mb-4">你的决策路径</h2>
        <ol className="space-y-6">
          {r.path.map((p, i) => (
            <li key={i} className="border-l-2 border-[var(--accent)] pl-5">
              <div className="text-[var(--muted)] text-base">{p.node_prompt}</div>
              <div className="mt-2 text-lg">→ {p.chosen}</div>
              <div className="sans text-base mt-2">
                <span className="text-[var(--muted)]">保护：</span>{p.protects.map((x) => L[x]).join("、") || "—"}
                <span className="text-[var(--muted)] ml-4">代价：</span>{p.sacrifices.map((x) => L[x]).join("、") || "—"}
              </div>
              {p.rationale && <div className="text-base mt-2 italic">你的理由：「{p.rationale}」</div>}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xl mb-4">价值取向</h2>
        <div className="sans space-y-3">
          {r.value_profile.map((v) => (
            <div key={v.principle} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base">
              <span className="w-24 shrink-0">{L[v.principle]}</span>
              <span className="text-[var(--accent)]">{"■".repeat(v.protected) || ""}</span>
              <span className="text-[var(--muted)]">{"□".repeat(v.sacrificed)}</span>
              <span className="text-sm text-[var(--muted)]">
                {v.protected ? `保护×${v.protected} ` : ""}
                {v.sacrificed ? `让步×${v.sacrificed}` : ""}
              </span>
            </div>
          ))}
        </div>
        <p className="sans text-sm text-[var(--muted)] mt-3">■ 被保护　□ 被让步。同一价值可能既被保护也被让步——这正是伦理张力所在。</p>
      </section>

      {r.value_conflicts.length > 0 && (
        <section>
          <h2 className="text-xl mb-4">涉及的价值冲突</h2>
          {r.value_conflicts.map((c, i) => (
            <p key={i} className="mb-2">
              <span className="text-[var(--accent)]">{L[c.a]} ⇄ {L[c.b]}</span>　{c.note}
            </p>
          ))}
        </section>
      )}

      <section>
        <h2 className="text-xl mb-4">服务对象状态的变化</h2>
        <div className="sans text-base grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {Object.keys(SL).map((k) => (
            <div key={k} className="flex justify-between border-b border-[var(--line)] py-1">
              <span>{SL[k]}</span>
              <span className="text-[var(--muted)]">
                {first[k]} → <span className="text-[var(--text)]">{last[k]}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl mb-4">不同的伦理视角</h2>
        <div className="space-y-5">
          {r.perspectives.map((p) => (
            <div key={p.stance}>
              <div className="text-[var(--accent)]">{p.stance}</div>
              <p className="text-[var(--muted)]">{p.argument}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl mb-4">不确定性</h2>
        <ul className="list-disc pl-5 text-[var(--muted)]">
          {r.uncertainty.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl mb-4">留给你的问题</h2>
        <ol className="list-decimal pl-5 space-y-2">
          {r.reflection_questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </section>

      {withLog && (
        <section className="log">
          <h2 className="text-xl mb-4">附：对话记录</h2>
          <div className="space-y-3 text-[0.95em]">
            {r.transcript.map((m, i) =>
              m.speaker === "system" ? (
                <p key={i} className="italic text-[var(--muted)] border-l-2 border-[var(--accent)] pl-3">
                  {m.text}
                </p>
              ) : (
                <p key={i}>
                  <b className="sans text-sm text-[var(--muted)]">{m.speaker === "worker" ? "社工" : r.client_name}：</b>
                  {m.text}
                </p>
              ),
            )}
          </div>
        </section>
      )}

      <footer className="sans text-sm text-[var(--muted)] border-t border-[var(--line)] pt-6 leading-relaxed">
        {r.disclaimer}
        <div className="mt-6 no-print">
          <Link href="/cases" className="btn">
            再试一次，做不同的选择
          </Link>
        </div>
      </footer>
    </main>
  );
}
