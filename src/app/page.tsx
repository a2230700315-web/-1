import Link from "next/link";

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-5xl">
      <p className="sans text-sm tracking-[0.3em] text-[var(--muted)] mb-6 fade-in">SOCIAL WORK AI LAB</p>
      <h1 className="text-4xl md:text-6xl font-light leading-tight fade-in">
        社会工作伦理
        <br />
        困境智能模拟器
      </h1>
      <p className="mt-8 text-lg text-[var(--muted)] max-w-xl fade-in">
        你是一名社会工作者。眼前的服务对象没有标准答案——只有不同的选择，各自保护了什么，又牺牲了什么。
      </p>
      <p className="mt-6 text-[var(--accent)] fade-in">AI 不替你做决定，AI 帮你思考。</p>
      <div className="mt-12 fade-in">
        <Link href="/cases" className="btn">
          进入模拟 →
        </Link>
      </div>
      <p className="sans mt-12 md:mt-24 text-sm text-[var(--muted)] max-w-xl leading-relaxed">
        本系统全部案例均为虚构的合成数据，仅用于教学与研究。AI 输出只作为反思材料，不构成任何专业、法律或医疗判断。
      </p>
    </main>
  );
}
