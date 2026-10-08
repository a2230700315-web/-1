"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CaseBrief {
  case_id: string;
  title: string;
  domain: string;
  difficulty: number;
  risk_level: string;
  nodes: unknown[];
}

export const EXPERT_KEY = "sw_expert";

export default function ExpertHome() {
  const [passcode, setPasscode] = useState("");
  const [code, setCode] = useState("");
  const [bg, setBg] = useState("");
  const [cases, setCases] = useState<CaseBrief[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function enter(pc = passcode, rc = code, b = bg) {
    setBusy(true);
    setError("");
    try {
      if (!/^[A-Za-z0-9_-]{2,24}$/.test(rc)) throw new Error("评议者编号需为 2-24 位字母、数字、-、_（请勿使用真实姓名）");
      const r = await fetch("/api/expert/cases", { headers: { "x-expert-passcode": pc } });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      sessionStorage.setItem(EXPERT_KEY, JSON.stringify({ passcode: pc, code: rc, bg: b }));
      setCases(d.cases);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(EXPERT_KEY);
    if (saved) {
      const v = JSON.parse(saved);
      setPasscode(v.passcode);
      setCode(v.code);
      setBg(v.bg ?? "");
      enter(v.passcode, v.code, v.bg ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cases)
    return (
      <main className="max-w-xl mx-auto px-5 md:px-6 py-10 md:py-20">
        <Link href="/" className="sans text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          ← 返回
        </Link>
        <h1 className="text-2xl md:text-3xl font-light mt-6">专家评议</h1>
        <p className="text-[var(--muted)] mt-3">
          评议的对象是情境、选项标注与对话设计，不是对学生的评价。你的意见将用于修订案例，并形成研究用的专家评价数据。
        </p>
        <div className="sans mt-8 space-y-4">
          <label className="block">
            <span className="text-sm text-[var(--muted)]">访问口令（由研究者提供）</span>
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="w-full mt-1 bg-[var(--panel)] border border-[var(--line)] p-3" />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--muted)]">评议者编号（匿名，如 E01；请勿填写真实姓名）</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="E01" className="w-full mt-1 bg-[var(--panel)] border border-[var(--line)] p-3" />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--muted)]">专业背景（选填，如“高校社工教师”“学校社工 10 年”）</span>
            <input value={bg} onChange={(e) => setBg(e.target.value)} className="w-full mt-1 bg-[var(--panel)] border border-[var(--line)] p-3" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn" disabled={busy || !passcode || !code} onClick={() => enter()}>
            进入评议
          </button>
        </div>
        <p className="sans text-xs text-[var(--muted)] mt-10 leading-relaxed">
          数据说明：系统只保存你的匿名编号、打分与文字意见，不收集姓名等身份信息。案例均为虚构的合成数据。
        </p>
      </main>
    );

  return (
    <main className="max-w-3xl mx-auto px-5 md:px-6 py-8 md:py-16">
      <Link href="/" className="sans text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        ← 返回
      </Link>
      <h1 className="text-2xl md:text-3xl font-light mt-6">专家评议 · {code}</h1>
      <p className="text-[var(--muted)] mt-3">选择一个案例开始。你可以随时离开，已提交的评议会保存，并可再次修改。</p>
      <div className="mt-8 space-y-4">
        {cases.map((c) => (
          <Link key={c.case_id} href={`/expert/${c.case_id}`} className="block border border-[var(--line)] bg-[var(--panel)] p-5 hover:border-[var(--accent)] transition">
            <div className="sans text-sm text-[var(--muted)] flex flex-wrap gap-x-4 gap-y-1 mb-2">
              <span>{c.domain}</span>
              <span>难度 {c.difficulty}/5</span>
              <span>风险：{c.risk_level === "high" ? "高" : c.risk_level === "medium" ? "中" : "低"}</span>
              <span>{c.nodes.length} 个决策节点</span>
            </div>
            <h2 className="text-xl">{c.title}</h2>
          </Link>
        ))}
      </div>
      <div className="sans mt-10 flex gap-3 text-sm">
        <button
          className="btn"
          onClick={async () => {
            const r = await fetch("/api/expert/export", { headers: { "x-expert-passcode": passcode } });
            const blob = await r.blob();
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "expert-reviews.csv";
            a.click();
          }}
        >
          导出全部评议（CSV）
        </button>
      </div>
    </main>
  );
}
