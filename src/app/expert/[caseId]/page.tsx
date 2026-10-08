"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

type Ratings = Record<string, number>;
interface Dim {
  key: string;
  label: string;
  hint: string;
}
interface Option {
  id: string;
  label: string;
  description: string;
  protects: string[];
  sacrifices: string[];
  consequences: string[];
  effects: { key: string; delta: number; reason: string }[];
  outcomeNarration: string;
}
interface CaseFull {
  case_id: string;
  version: string;
  title: string;
  domain: string;
  population: string;
  setting: string;
  initial_state: string;
  opening_line: string;
  ethical_conflicts: { between: string[]; note: string }[];
  stakeholders: { id: string; name: string; role: string; interest: string }[];
  institutional_constraints: string[];
  client: { name: string; background: string; decision_policy: string; knowledge: { knows: string[]; does_not_know: string[] } };
  nodes: { id: string; prompt: string; low_disclosure_prompt?: string; options: Option[] }[];
  knowledge_sources: { title: string; verified: boolean }[];
}
interface Review {
  target_type: string;
  target_ref: string;
  ratings: Ratings;
  comment?: string;
}

function ReviewBox({
  targetType,
  targetRef,
  dims,
  existing,
  onSave,
  dimKeys,
}: {
  targetType: string;
  targetRef: string;
  dims: Dim[];
  dimKeys?: string[];
  existing?: Review;
  onSave: (type: string, ref: string, ratings: Ratings, comment: string) => Promise<string | null>;
}) {
  const use = dimKeys ? dims.filter((d) => dimKeys.includes(d.key)) : dims;
  const [ratings, setRatings] = useState<Ratings>(existing?.ratings ?? {});
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setRatings(existing?.ratings ?? {});
    setComment(existing?.comment ?? "");
  }, [existing]);

  return (
    <div className="sans border border-[var(--line)] bg-[var(--bg)] p-3 md:p-4 mt-3">
      <div className="space-y-2">
        {use.map((d) => (
          <div key={d.key} className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="w-28 shrink-0 text-sm" title={d.hint}>
              {d.label}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRatings({ ...ratings, [d.key]: n })}
                  className={`w-9 h-9 border text-sm ${ratings[d.key] === n ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-[var(--panel)] border-[var(--line)] text-[var(--muted)]"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="text-xs text-[var(--muted)]">{d.hint}</div>
          </div>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="文字意见（可选）：哪里不合理？应如何修改？"
        className="w-full mt-3 bg-[var(--panel)] border border-[var(--line)] p-2 text-sm"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          className="btn"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            const err = await onSave(targetType, targetRef, ratings, comment);
            setMsg(err ?? "已保存 ✓");
            setSaving(false);
          }}
        >
          保存
        </button>
        <span className={`text-sm ${msg.startsWith("已") ? "text-[var(--accent)]" : "text-red-600"}`}>{msg}</span>
      </div>
    </div>
  );
}

export default function ExpertCase({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = use(params);
  const [auth, setAuth] = useState<{ passcode: string; code: string; bg: string } | null>(null);
  const [c, setC] = useState<CaseFull | null>(null);
  const [dims, setDims] = useState<Dim[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async (a: { passcode: string; code: string }) => {
    const h = { "x-expert-passcode": a.passcode };
    const d = await (await fetch("/api/expert/cases", { headers: h })).json();
    if (d.error) return setError(d.error);
    setC(d.cases.find((x: CaseFull) => x.case_id === caseId) ?? null);
    setDims(d.dimensions);
    setLabels(d.principle_labels);
    const rv = await (await fetch(`/api/expert/reviews?case_id=${caseId}&reviewer_code=${a.code}`, { headers: h })).json();
    setReviews(rv.reviews ?? []);
  }, [caseId]);

  useEffect(() => {
    const saved = sessionStorage.getItem("sw_expert");
    if (!saved) return setError("请先从评议首页登录");
    const a = JSON.parse(saved);
    setAuth(a);
    load(a);
  }, [load]);

  async function save(type: string, ref: string, ratings: Ratings, comment: string): Promise<string | null> {
    if (!auth || !c) return "未登录";
    const r = await fetch("/api/expert/reviews", {
      method: "POST",
      headers: { "content-type": "application/json", "x-expert-passcode": auth.passcode },
      body: JSON.stringify({ reviewer_code: auth.code, reviewer_background: auth.bg, target_type: type, case_id: c.case_id, case_version: c.version, target_ref: ref, ratings, comment }),
    });
    const d = await r.json();
    if (d.error) return d.error;
    setReviews((prev) => [...prev.filter((x) => !(x.target_type === type && x.target_ref === ref)), { target_type: type, target_ref: ref, ratings, comment }]);
    return null;
  }

  const find = (t: string, ref: string) => reviews.find((x) => x.target_type === t && x.target_ref === ref);

  if (error)
    return (
      <main className="p-8">
        {error}
        <div className="mt-4">
          <Link href="/expert" className="btn">
            返回评议首页
          </Link>
        </div>
      </main>
    );
  if (!c) return <main className="p-8 text-[var(--muted)]">加载中…</main>;

  return (
    <main className="max-w-3xl mx-auto px-5 md:px-6 py-8 md:py-14 space-y-8">
      <Link href="/expert" className="sans text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        ← 案例列表
      </Link>
      <header>
        <h1 className="text-2xl md:text-3xl font-light">{c.title}</h1>
        <p className="sans text-sm text-[var(--muted)] mt-2">
          {c.domain} · {c.population} · {c.setting} · v{c.version}
        </p>
        <p className="text-sm text-[var(--muted)] mt-3 sans">
          评议者可以看到学生看不到的内容：每个选项保护/牺牲的价值、后果与对状态的影响。请重点检查它们是否合理、是否暗示了“标准答案”。
        </p>
      </header>

      <section>
        <h2 className="text-xl mb-2">情境与人物</h2>
        <p className="text-[var(--muted)] italic">{c.initial_state}</p>
        <p className="mt-3">
          <span className="sans text-sm text-[var(--muted)]">{c.client.name}的开场：</span>
          {c.opening_line}
        </p>
        <div className="sans text-sm mt-3 space-y-1">
          <div>
            <b>背景：</b>
            {c.client.background}
          </div>
          <div>
            <b>行为策略：</b>
            {c.client.decision_policy}
          </div>
          <div>
            <b>知道：</b>
            {c.client.knowledge.knows.join("；")}　<b>不知道：</b>
            {c.client.knowledge.does_not_know.join("；")}
          </div>
          <div>
            <b>价值冲突：</b>
            {c.ethical_conflicts.map((x) => `${labels[x.between[0]]} ⇄ ${labels[x.between[1]]}（${x.note}）`).join("；")}
          </div>
          <div>
            <b>利益相关者：</b>
            {c.stakeholders.map((s) => `${s.name}（${s.role}）`).join("、")}
          </div>
          <div>
            <b>机构约束：</b>
            {c.institutional_constraints.join("；")}
          </div>
          <div>
            <b>规范来源：</b>
            {c.knowledge_sources.map((k) => `${k.title}${k.verified ? "" : "【未核对】"}`).join("；")}
          </div>
        </div>
        <h3 className="text-base mt-5 sans">对整个案例的评议</h3>
        <ReviewBox targetType="case" targetRef="overall" dims={dims} existing={find("case", "overall")} onSave={save} />
      </section>

      {c.nodes.map((n, ni) => (
        <section key={n.id}>
          <h2 className="text-xl mb-2">决策节点 {ni + 1}</h2>
          <p>{n.prompt}</p>
          {n.low_disclosure_prompt && <p className="sans text-sm text-[var(--muted)] mt-1">（信任未建立时的版本）{n.low_disclosure_prompt}</p>}
          <div className="space-y-6 mt-4">
            {n.options.map((o) => (
              <div key={o.id} className="border-l-2 border-[var(--accent)] pl-4">
                <div className="text-lg">{o.label}</div>
                <div className="text-[var(--muted)] text-sm">{o.description}</div>
                <div className="sans text-sm mt-2 space-y-1">
                  <div>
                    <b>保护：</b>
                    {o.protects.map((p) => labels[p]).join("、")}　<b>牺牲：</b>
                    {o.sacrifices.map((p) => labels[p]).join("、")}
                  </div>
                  <div>
                    <b>可能后果：</b>
                    {o.consequences.join("；")}
                  </div>
                  <div>
                    <b>对服务对象状态：</b>
                    {o.effects.map((e) => `${e.key} ${e.delta > 0 ? "+" : ""}${e.delta}（${e.reason}）`).join("；")}
                  </div>
                  <div>
                    <b>此后情境：</b>
                    {o.outcomeNarration}
                  </div>
                </div>
                <ReviewBox targetType="option" targetRef={o.id} dims={dims} existing={find("option", o.id)} onSave={save} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="text-xl mb-2">对话片段评议（选填）</h2>
        <p className="sans text-sm text-[var(--muted)]">
          在模拟页与“{c.client.name}”实际对话后，如发现不真实、越界或带有偏见的回复，可把原话粘贴在这里。
        </p>
        <DialogueBox onSave={save} dims={dims} />
      </section>
    </main>
  );
}

function DialogueBox({ dims, onSave }: { dims: Dim[]; onSave: (t: string, r: string, ratings: Ratings, c: string) => Promise<string | null> }) {
  const [text, setText] = useState("");
  const [n, setN] = useState(1);
  return (
    <div className="mt-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="粘贴学生的话与服务对象的回复…" className="sans w-full bg-[var(--panel)] border border-[var(--line)] p-2 text-sm" />
      <ReviewBox
        key={n}
        targetType="dialogue"
        targetRef={`d${n}-${Math.abs(hash(text)).toString(36)}`}
        dims={dims}
        dimKeys={["realism", "professional_validity", "safety_bias"]}
        onSave={async (t, r, ratings, comment) => {
          const err = await onSave(t, r, ratings, `${comment}\n【对话摘录】${text}`.trim());
          if (!err) {
            setText("");
            setN(n + 1);
          }
          return err;
        }}
      />
    </div>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
