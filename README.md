# Social Work AI Lab · 社会工作伦理困境智能模拟器（V0.1 MVP）

> AI does not decide. AI helps social workers think.

## 运行

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 单元测试
npm run typecheck
```

- 不配置 API Key 也能完整体验：服务对象回复使用基于状态的确定性兜底（Mock Provider）。
- 接入 Claude：复制 `.env.example` 为 `.env.local`，填入 `ANTHROPIC_API_KEY`，重启即可。

## 流程

Landing → 选择情境 → 与服务对象（Agent）多轮交谈 → 决策节点 → 情境变化 → 价值冲突展示 → 伦理反思报告

## 结构

```
src/core/
  schemas/     Case / Agent / Ethics / Session / Reflection / Research 类型
  llm/         LLMProvider 接口 + ClaudeProvider + MockProvider（唯一装配点 llm/index.ts）
  cases/       结构化案例（合成数据）
  agents/      服务对象 Agent、可解释 State 机制
  ethics/      伦理原则、选择分析、反思报告
  simulation/  会话引擎、存储接口、前端视图
  research/    Research Mode：JSONL 实验日志（data/research-log.jsonl，已 gitignore）
src/app/       Next.js 页面与 API Route
tests/         核心逻辑测试
```

## V0.1 的已知取舍

- 会话存于进程内存（重启即丢失），通过 `SessionStore` 接口隔离，后续换 PostgreSQL。
- 案例为手工结构化的单个合成案例；参数化案例生成器（Case Engine）尚未实现。
- 行为分类默认为规则匹配（关键词），有 Claude 时由 LLM 分类。规则分类较粗糙。
- 状态变化数值为教学启发式，不是经验测量。
- `knowledge_sources` 均标记为 `verified: false`，需人工核对后才能作为引用展示。

详见 [CLAUDE.md](CLAUDE.md) 与 [docs/](docs/)。

## 部署到 Cloudflare（Workers + D1）

需在**不含中文的路径**下构建（OpenNext 在中文路径 / Windows 上会失败），推荐 WSL 或 GitHub 自动构建。

```bash
npx wrangler login
npx wrangler d1 create social-work-ai-lab      # 把输出的 database_id 填入 wrangler.jsonc
npm run db:migrate                             # 建表（远程）
npx wrangler secret put ARK_API_KEY
npx wrangler secret put ARK_MODEL
npm run deploy
```

本地模拟 Workers 环境：`npm run db:migrate:local && npm run preview`。
