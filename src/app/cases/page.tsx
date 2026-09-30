import Link from "next/link";
import { listCases, toPublicSummary } from "@/core/cases";

export default function Cases() {
  const cases = listCases().map(toPublicSummary);
  return (
    <main className="min-h-screen px-8 md:px-24 py-20 max-w-5xl">
      <Link href="/" className="sans text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        ← 返回
      </Link>
      <h2 className="text-3xl font-light mt-8 mb-12">选择一个情境</h2>
      {cases.map((c) => (
        <Link
          key={c.case_id}
          href={`/simulation/${c.case_id}`}
          className="block border border-[var(--line)] bg-[var(--panel)] p-8 hover:border-[var(--accent)] transition fade-in"
        >
          <div className="sans text-sm text-[var(--muted)] flex gap-4 mb-3">
            <span>{c.domain}</span>
            <span>难度 {"●".repeat(c.difficulty)}{"○".repeat(5 - c.difficulty)}</span>
            <span>风险：{c.risk_level === "high" ? "高" : c.risk_level === "medium" ? "中" : "低"}</span>
            <span>合成案例</span>
          </div>
          <h3 className="text-2xl mb-3">{c.title}</h3>
          <p className="text-[var(--muted)]">{c.initial_state}</p>
          <p className="sans text-sm text-[var(--muted)] mt-4">
            {c.population} · {c.setting} · {c.stakeholders.length} 位利益相关者
          </p>
        </Link>
      ))}
      <p className="sans text-sm text-[var(--muted)] mt-10">更多情境将在后续版本加入。</p>
    </main>
  );
}
