# CLAUDE.md

Social Work AI Lab —— 长期科研+产品项目。当前只做 Social Work Ethics Simulator（V0.1）。
完整愿景与约束见根目录的《Social Work AI Lab — 项目初始化与架构设计任务.md》。

## 不可违背的原则
- Human-in-the-loop：涉及安全、儿童保护、法律、医疗、强制干预时，AI 输出不得呈现为最终专业判断。
- 不设“唯一正确答案”；展示每个选择保护/牺牲了什么价值。反思报告不得变成道德评分。
- 不得虚构法规、论文、专业规范引用；未核对来源必须 `verified: false`。
- 仅使用合成数据；真实个案数据须先完成数据治理设计。
- Agent ≠ Model：Agent/Engine 只依赖 `LLMProvider` 接口，不得直接 import 厂商 SDK。新增 Provider 只改 `src/core/llm/`。

## 约定
- 核心逻辑放 `src/core/`，与 Next.js 无关，必须可单元测试。
- 状态变化必须带 `reason`（可解释）。
- 重要事件写入 research log（含 model / prompt_version / case_version）。
- 不引入不必要依赖；不预先做多 Provider、自动路由、多 Agent。

## 命令
`npm run dev` · `npm test` · `npm run typecheck` · `npm run build`

## 路线
V0.1 单 Client Agent（当前）→ V0.2 参数化 Case Engine + PostgreSQL → V0.3 家属/督导/机构 Agent → V1.0 Multi-Agent。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
