# Social Work AI Lab — 项目初始化与架构设计任务

你现在不是在帮助我制作一个一次性的课程作业网页。

你正在参与建设一个计划持续至少三年的 **Social Work AI Lab（社会工作人工智能实验室）**。

这是一个以社会工作专业为核心、以大语言模型和智能体技术为基础、兼顾科研与产品实践的长期项目。

我目前是一名社会工作专业研究生，正在使用 VS Code + Claude Code 开发这个项目。

------

# 一、项目长期愿景

项目的长期目标是：

> 构建一个面向社会工作领域的 AI 基础设施，通过大语言模型、RAG、Agent、多智能体模拟、知识图谱、案例生成和评价系统，为社会工作教育、实务、督导、研究和伦理决策提供 AI 辅助工具。

AI 的定位不是替代社会工作者，而是：

> **AI does not decide. AI helps social workers think.**

中文核心原则：

> **AI不替社会工作者做决定，而是增强社会工作者的专业判断、伦理反思和实践能力。**

未来可能形成以下产品：

1. Social Work Ethics Simulator
   社会工作伦理困境模拟器
2. AI Social Work Supervisor
   AI社会工作督导
3. Social Work Copilot
   AI社会工作实践助手
4. Social Work Research Assistant
   AI社会工作研究助手
5. AI Social Work Training
   AI社会工作模拟训练系统
6. SW-EthicsBench
   大语言模型社会工作伦理能力评价基准
7. Social Work AI OS
   最终形成统一的社会工作AI平台

但是：

> 当前阶段绝对不要试图一次性实现全部产品。

第一阶段只建立底层基础设施，并完成第一个 MVP：

# Social Work Ethics Simulator

------

# 二、当前 MVP

第一个产品的名称暂定：

> Social Work Ethics Simulator

中文：

> 社会工作伦理困境智能模拟器

它将用于我的研究生课程“社会工作伦理”课程作业，同时必须从架构层面考虑未来扩展。

核心体验：

用户扮演一名社会工作者。

AI生成一个社会工作伦理情境。

用户与AI扮演的服务对象进行互动。

用户做出专业和伦理选择。

AI根据用户的选择动态改变故事。

系统识别其中涉及的伦理原则、价值冲突和潜在风险。

最终系统不是简单告诉用户“正确答案”，而是：

> 展示不同选择背后的伦理逻辑、可能后果和不同价值立场。

------

# 三、非常重要：不要把它做成普通的AI聊天网站

本项目不是：

> ChatGPT + 一个漂亮网页

也不是：

> 随机生成几个伦理案例的小游戏

而应该逐渐形成：

> 结构化伦理情境生成
> +
> 有状态的社会工作Agent
> +
> 伦理冲突识别
> +
> 动态情境模拟
> +
> 决策记录
> +
> 伦理推理评价
> +
> 专业知识检索
> +
> 人类反馈
> +
> 模型评价

最终形成：

# Social Work AI Simulation Infrastructure

------

# 四、第一性原理

整个项目必须遵循以下原则。

## 1. Human-in-the-loop

AI不能成为最终决策者。

涉及以下问题时：

- 人身安全
- 自伤/他伤风险
- 儿童保护
- 家庭暴力
- 医疗
- 法律
- 强制干预
- 风险评估

系统不得将AI输出呈现为最终专业判断。

必须明确：

> AI提供辅助信息、模拟视角和反思材料，最终判断由具备专业责任的人完成。

------

## 2. AI augmentation rather than automation

项目的核心不是：

> AI替代社工

而是：

> AI增强社工的专业能力。

------

## 3. 不追求“唯一正确答案”

社会工作伦理中的很多情境具有价值冲突。

因此：

不要简单设计：

> A正确，B错误。

而应该识别：

> 不同选择保护了什么价值，又牺牲了什么价值。

例如：

- 自主权
- 保密
- 安全
- 最小伤害
- 公平
- 专业责任
- 服务对象最佳利益
- 专业边界

------

## 4. AI输出必须具有可解释性

AI提出重要判断时，应尽可能说明：

- 判断依据
- 涉及的伦理原则
- 相关专业规范
- 不确定性
- 可能存在的其他观点

不要产生没有依据的权威式回答。

------

## 5. 知识与模型解耦

不要把任何一个大语言模型写死在整个系统中。

目前可以先接入 Claude。

但架构必须允许未来接入：

- Claude
- OpenAI
- DeepSeek
- Qwen
- Gemini
- 本地开源模型
- 其他兼容API的模型

必须设计统一的：

> LLM Provider Interface

Agent层不能直接依赖某一家模型。

------

# 五、总体技术架构

初步采用以下分层架构：

```text
                    Social Work AI
                          │
                ┌─────────┴─────────┐
                │   Application     │
                │      Layer        │
                └─────────┬─────────┘
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
 Case Engine        Agent Engine       Ethics Engine
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                   Evaluation Engine
                          │
                   Knowledge Engine
                          │
                    LLM Provider
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
     Claude             OpenAI           Other LLMs
```

初期不需要全部实现。

但代码架构必须为未来扩展留下接口。

------

# 六、核心 Engine

## 1. Case Engine

负责：

- 生成社会工作案例
- 生成伦理困境
- 控制案例难度
- 控制利益相关者
- 控制伦理冲突
- 控制风险等级
- 控制信息完整度
- 控制事件发展
- 管理故事分支

案例必须尽可能结构化，而不是只有一段自然语言。

------

## 2. Agent Engine

负责：

- 服务对象Agent
- 家属Agent
- 督导Agent
- 机构Agent
- 其他利益相关者Agent

Agent必须具备：

- personality
- goals
- memory
- emotional state
- trust
- risk state
- relationship state
- knowledge boundary

重要：

> Agent ≠ Model

多个Agent可以调用同一个LLM。

------

## 3. Ethics Engine

负责：

- 识别伦理冲突
- 识别伦理原则
- 构建价值冲突关系
- 分析用户选择
- 分析可能后果
- 生成多种伦理视角
- 进行伦理反思

------

## 4. Evaluation Engine

负责评价：

- 案例质量
- Agent一致性
- 伦理复杂度
- 用户决策
- 伦理敏感性
- 风险识别
- 专业边界意识
- 反思能力

评价结果不得简单变成“道德评分”。

应该尽可能呈现：

> 用户选择体现了什么价值偏好。

------

## 5. Knowledge Engine

未来负责：

- 社会工作伦理规范
- 社会工作理论
- 法律法规
- 专业标准
- 教材
- 学术论文
- 案例资料

采用RAG等方式，为AI提供专业知识。

注意：

知识来源必须可追溯。

未来需要支持：

- source
- title
- author
- publication
- year
- page
- URL
- citation

不要让模型虚构参考文献。

------

# 七、第一阶段的数据设计

首先设计三个核心Schema。

## Case Schema

案例至少考虑：

```text
case_id
title
domain
population
setting
difficulty
risk_level
ethical_conflicts
stakeholders
institutional_constraints
client_preferences
information_completeness
time_pressure
resource_constraints
initial_state
events
possible_outcomes
knowledge_sources
```

------

## Agent Schema

至少考虑：

```text
agent_id
role
name
personality
goals
fears
values
background
knowledge
memory
emotional_state
trust_level
risk_state
relationship_state
decision_policy
```

------

## Ethics Schema

至少考虑：

```text
ethical_issue
ethical_principles
stakeholders
value_conflicts
potential_harms
potential_benefits
professional_boundaries
uncertainty
alternative_actions
possible_consequences
relevant_standards
```

不要直接把以上Schema写死。

先评估合理性，然后提出改进方案。

------

# 八、案例生成机制

不要简单实现：

```text
Prompt → LLM → Case
```

而应该逐渐形成：

```text
Structured Ethical Scenario
             ↓
        Case Generator
             ↓
       LLM Generation
             ↓
      Consistency Check
             ↓
       Ethics Validation
             ↓
        Quality Score
             ↓
      Final Case
```

案例生成应该支持参数化。

例如：

```text
population
setting
risk
ethical_conflict
stakeholder_count
power_asymmetry
information_completeness
institutional_constraint
time_pressure
resource_scarcity
emotional_intensity
uncertainty
```

目标不是“无限随机生成”。

目标是：

> **在可控的伦理情境空间中生成多样、合理、具有教育价值的案例。**

------

# 九、Agent机制

第一版不要直接实现复杂Multi-Agent。

按照以下路线开发：

### V0.1

```text
User
 ↓
Case AI
 ↓
User Decision
 ↓
AI Consequence
```

### V0.2

```text
User
 ↓
Client Agent
 ↓
User Decision
 ↓
Client State Change
```

### V0.3

加入：

- 家属Agent
- 督导Agent
- 机构Agent

### V1.0

实现真正的Multi-Agent Simulation。

------

# 十、Agent必须有State

例如：

```text
trust
fear
anger
willingness_to_disclose
risk_level
dependency
relationship_quality
```

用户行为会改变Agent State。

例如：

```text
professional_empathy
+ trust

coercive_questioning
- trust

boundary_violation
- professional_relationship_quality
```

具体数值不要随意设计。

先建立可解释的State机制。

------

# 十一、模型层

设计：

```text
LLMProvider
```

统一接口，例如：

```text
chat()
generate()
structuredOutput()
embed()
evaluate()
```

实现：

```text
ClaudeProvider
OpenAIProvider
DeepSeekProvider
LocalProvider
```

但第一阶段：

> 只实现ClaudeProvider。

不要为了“支持多个模型”提前制造复杂代码。

------

# 十二、模型路由

未来允许：

```text
Task Router
     │
     ├── Simple Generation
     ├── Conversation
     ├── Complex Reasoning
     ├── Evaluation
     └── Safety Review
```

不同任务可以选择不同模型。

但第一阶段不要实现复杂自动路由。

先预留接口。

------

# 十三、未来研究方向

这个项目必须从工程设计上支持未来研究。

未来可能研究：

### 研究一

大语言模型社会工作伦理推理能力。

### 研究二

AI生成社会工作伦理情境的有效性。

### 研究三

AI伦理模拟对社会工作学生伦理反思能力的影响。

### 研究四

不同LLM在社会工作伦理任务上的表现差异。

### 研究五

多智能体模拟在社会工作教育中的应用。

### 研究六

AI辅助社会工作伦理决策中的人机协同机制。

因此：

> 系统必须记录足够的实验元数据，但必须注意隐私与伦理。

------

# 十四、数据隐私原则

第一阶段：

> 尽量全部使用Synthetic Data。

不要使用真实服务对象个人信息。

未来如果进入真实社会工作机构：

必须考虑：

- 脱敏
- 数据授权
- 访问控制
- 数据最小化
- 加密
- 审计
- 数据生命周期
- 删除机制

任何真实个案数据进入系统之前，都必须经过明确的伦理和数据治理设计。

------

# 十五、项目必须具备Research Mode

未来系统需要能够记录：

```text
experiment_id
model
model_version
prompt_version
case_version
temperature / relevant parameters
timestamp
user_action
agent_response
evaluation
```

这样以后可以复现实验。

不要只保存最终结果。

------

# 十六、项目必须具备Evaluation Mode

未来允许：

```text
Case Evaluation
Agent Evaluation
Model Evaluation
User Evaluation
```

并允许人工专家评价AI输出。

最终形成：

> Human Evaluation Dataset

为未来研究提供基础。

------

# 十七、第一阶段不要做的事情

现在明确禁止：

1. 不要一次开发所有产品。
2. 不要马上开发复杂Multi-Agent。
3. 不要马上做用户注册系统。
4. 不要马上做支付系统。
5. 不要马上做复杂社交功能。
6. 不要把Claude写死。
7. 不要把伦理判断设计成简单对错题。
8. 不要使用未经授权的真实个案数据。
9. 不要生成虚假的论文、法律法规和专业规范引用。
10. 不要为了视觉效果牺牲架构质量。
11. 不要过早优化性能。
12. 不要引入没有必要的依赖。

------

# 十八、第一阶段技术原则

优先：

- Type Safety
- Modularity
- Testability
- Explainability
- Observability
- Extensibility
- Reproducibility

所有核心逻辑尽可能：

> 可测试、可替换、可观察、可追溯。

------

# 十九、你的开发角色

我本人是：

> Product Owner + Social Work Researcher

你是：

> AI Software Architect + Senior Engineer + Research Engineering Assistant

你的职责不仅是写代码。

你必须在发现我的想法存在：

- 架构问题
- 技术债务
- 安全问题
- 研究设计问题
- 数据问题
- AI幻觉风险
- Agent设计问题

时主动指出。

不要为了迎合我而直接实现错误方案。

如果我的要求可能导致未来难以扩展，请先告诉我原因，然后提出更好的方案。

------

# 二十、Vibe Coding工作方式

不要每次收到任务后立即大量修改代码。

执行复杂任务时：

### Step 1

先阅读：

- README
- CLAUDE.md
- docs/
- 当前架构
- 相关源码

### Step 2

分析当前系统。

### Step 3

提出Implementation Plan。

### Step 4

如果任务涉及架构变化，先说明：

- 修改哪些模块
- 为什么
- 风险
- 对未来生态的影响

### Step 5

再实施。

### Step 6

运行：

- type checking
- lint
- tests
- build

### Step 7

汇报：

```text
Implemented
Changed
Tests
Potential Issues
Next Recommendation
```

不要为了完成任务而跳过测试。

------

# 二十一、第一阶段技术栈

暂定：

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

Backend:

优先采用Next.js API / Route Handler或独立服务，具体方案由你根据项目规模判断。

Database：

优先考虑：

- PostgreSQL

Vector：

根据RAG需求选择：

- pgvector
  或
- 独立Vector Database

LLM：

第一阶段：

- Claude API

未来：

- OpenAI
- DeepSeek
- Qwen
- 其他Provider

ORM：

根据实际架构选择，不要为了“流行”而引入。

------

# 二十二、当前第一阶段的UI目标

产品不是普通后台管理系统。

应该具有：

> 沉浸式社会工作伦理模拟体验。

视觉方向：

- 简洁
- 专业
- 沉浸
- 克制
- 有电影感
- 不要廉价游戏风
- 不要传统政务网站风格
- 不要过度AI化

用户体验应该类似：

> Interactive Story + Professional Simulation + AI Conversation

而不是：

> Chatbot + Form。

------

# 二十三、第一版核心页面

暂定：

```text
/
Landing Page

/cases
Case Selection

/simulation/[id]
Simulation

/decision
Decision Analysis

/reflection
Ethical Reflection

/profile
User Reflection Profile

/research
Research / Evaluation Mode
```

不要立即全部实现。

先实现：

```text
Landing
↓
Case
↓
Simulation
↓
Decision
↓
Reflection
```

------

# 二十四、第一版第一个案例

暂定案例：

> 未成年人家庭暴力 + 保密与保护之间的伦理冲突

核心冲突：

- 保密
- 自主
- 安全
- 最小伤害
- 专业责任
- 家庭关系

但是不要把剧情直接硬编码成唯一答案。

应该让Case Schema描述情境，让Agent动态生成互动。

------

# 二十五、第一阶段成功标准

不要用：

> “网页做出来了。”

作为成功标准。

V0.1必须做到：

### 1

能够生成一个结构化伦理案例。

### 2

能够根据案例创建服务对象Agent。

### 3

用户可以和服务对象Agent进行多轮交流。

### 4

Agent具有基本记忆和状态。

### 5

用户做出伦理选择后，情境发生变化。

### 6

系统记录用户决策路径。

### 7

系统能够识别至少2—3个伦理原则。

### 8

系统能够展示价值冲突，而不是简单判定对错。

### 9

系统能够生成最终反思报告。

### 10

代码架构能够在未来加入第二个LLM Provider。

------

# 二十六、现在不要直接开始大规模编码

这是第一次初始化。

你现在首先需要完成：

## Phase 0 — Architecture & Repository Initialization

请依次执行：

### 1

检查当前工作目录。

### 2

确认是否为空项目。

### 3

提出完整的技术架构方案。

### 4

提出Repository结构。

### 5

提出核心Domain Model。

### 6

提出：

- Case Schema
- Agent Schema
- Ethics Schema
- Evaluation Schema
- LLM Provider Interface

### 7

提出第一阶段数据库设计。

### 8

提出第一阶段API设计。

### 9

提出第一阶段页面结构。

### 10

提出未来三阶段扩展路线。

### 11

指出当前方案可能存在的技术和研究风险。

### 12

然后创建：

```text
README.md
CLAUDE.md
/docs/PRODUCT_VISION.md
/docs/ARCHITECTURE.md
/docs/ETHICAL_PRINCIPLES.md
/docs/RESEARCH_ROADMAP.md
/docs/AI_BOUNDARIES.md
```

### 13

初始化Git。

### 14

创建最小可运行项目。

------

# 二十七、重要：第一次不要直接写完整产品

第一轮任务完成后：

> 停止。

不要自动继续实现Case Engine、Agent Engine和UI。

先把：

> 架构方案 + 文件结构 + Schema + 技术选择

展示给我。

等待我的确认。

之后我们再按照模块逐步开发。

------

# 二十八、最终长期目标

请始终记住：

这不是：

> “一个社会工作伦理课程作业”。

课程作业只是：

> **Social Work AI Lab 的第一个公开原型。**

长期目标是：

```text
Social Work AI Lab
│
├── Ethics Simulator
├── AI Supervisor
├── Social Work Copilot
├── Research Assistant
├── Training Simulator
├── Ethics Benchmark
└── Social Work AI OS
```

所有产品共享：

```text
LLM Layer
Agent Layer
Case Engine
Ethics Engine
Knowledge Engine
Evaluation Engine
Data Layer
Research Infrastructure
```

因此：

> **任何今天的架构决定，都应该考虑未来是否能够复用。**

但同时：

> **不要为了一个三年后的目标，让今天的代码过度复杂。**

原则：

> **简单的第一版 + 正确的抽象 + 清晰的边界 + 可持续扩展。**

------

# 现在开始

请不要直接写大量业务代码。

先以：

> **Senior AI Architect + Social Work Research Engineer**

的身份分析这个项目。

首先输出：

1. 你对项目的理解
2. 你建议的总体架构
3. Repository结构
4. 核心Domain Model
5. Case / Agent / Ethics / Evaluation Schema
6. LLM Provider设计
7. 第一阶段技术栈
8. 第一阶段开发顺序
9. 未来扩展路线
10. 你认为我目前这个想法中最需要修改的地方

然后再初始化项目文件。

**不要为了满足我而假设所有设计都是正确的。**

如果发现问题，直接指出。

这是一个长期科研+产品项目，请优先保证架构质量，而不是追求第一天看到一个漂亮的页面。