/**
 * 核心 Domain Schema（V0.1）。
 * 这些类型是各 Engine 之间的唯一契约；Agent 层不得依赖任何具体 LLM。
 */

export type PrincipleId =
  | "confidentiality"
  | "autonomy"
  | "safety"
  | "minimize_harm"
  | "professional_responsibility"
  | "family_relationship"
  | "professional_boundary";

export interface EthicalPrinciple {
  id: PrincipleId;
  label: string;
  description: string;
}

// ---------- Case ----------
export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  interest: string;
  power: "low" | "medium" | "high";
}

export interface CaseEvent {
  id: string;
  narration: string;
}

export interface KnowledgeSource {
  title: string;
  source: string;
  author?: string;
  year?: number;
  page?: string;
  url?: string;
  /** 未核对的条目不得作为权威引用展示 */
  verified: boolean;
}

export interface AgentState {
  trust: number; // 0-100
  fear: number;
  anger: number;
  willingness_to_disclose: number;
  risk_level: number;
  dependency: number;
  relationship_quality: number;
}
export type StateKey = keyof AgentState;

export interface StateEffect {
  key: StateKey;
  delta: number;
  reason: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  /** 该选择所体现/保护的价值 */
  protects: PrincipleId[];
  /** 该选择所牺牲/承担风险的价值 */
  sacrifices: PrincipleId[];
  /** 可能的后果（多种，含不确定性），不是"标准答案" */
  consequences: string[];
  /** 对 Agent 状态的可解释影响 */
  effects: StateEffect[];
  /** 决策后展示的情境变化 */
  outcomeNarration: string;
  /** 用于下一节点分支 */
  branchKey: string;
}

export interface DecisionNode {
  id: string;
  prompt: string;
  /** 节点出现前的情境叙述；可按此前分支选择不同版本，"default" 兜底 */
  narrationByBranch: Record<string, string>;
  options: DecisionOption[];
  /** 触发前用户至少需要与服务对象交流的轮数 */
  minTurns: number;
}

export interface EthicsCase {
  case_id: string;
  version: string;
  title: string;
  domain: string;
  population: string;
  setting: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  risk_level: "low" | "medium" | "high";
  ethical_conflicts: { between: [PrincipleId, PrincipleId]; note: string }[];
  stakeholders: Stakeholder[];
  institutional_constraints: string[];
  client_preferences: string[];
  information_completeness: number; // 0-1
  time_pressure: "low" | "medium" | "high";
  resource_constraints: string[];
  initial_state: string;
  events: CaseEvent[];
  decision_nodes: DecisionNode[];
  possible_outcomes: string[];
  knowledge_sources: KnowledgeSource[];
  synthetic: true; // 第一阶段仅允许合成数据
  /** 涉及人身安全/儿童保护等，必须展示 Human-in-the-loop 提示 */
  human_in_the_loop_required: boolean;
  client_agent: AgentProfile;
  initial_client_state: AgentState;
  opening_line: string;
}

// ---------- Agent ----------
export interface MemoryItem {
  turn: number;
  speaker: "worker" | "client" | "system";
  text: string;
}

export interface AgentProfile {
  agent_id: string;
  role: "client" | "family" | "supervisor" | "institution";
  name: string;
  personality: string[];
  goals: string[];
  fears: string[];
  values: string[];
  background: string;
  /** 知识边界：Agent 知道/不知道什么 */
  knowledge: { knows: string[]; does_not_know: string[] };
  decision_policy: string;
}

export interface AgentRuntime {
  profile: AgentProfile;
  state: AgentState;
  memory: MemoryItem[];
}

export type ApproachTag =
  | "professional_empathy"
  | "coercive_questioning"
  | "boundary_violation"
  | "explains_limits"
  | "false_promise"
  | "dismissive"
  | "neutral";

// ---------- Ethics ----------
export interface EthicsAnalysis {
  ethical_issue: string;
  ethical_principles: PrincipleId[];
  value_conflicts: { a: PrincipleId; b: PrincipleId; note: string }[];
  potential_harms: string[];
  potential_benefits: string[];
  professional_boundaries: string[];
  uncertainty: string[];
  alternative_actions: string[];
  possible_consequences: string[];
  relevant_standards: KnowledgeSource[];
}

// ---------- Simulation / Session ----------
export interface DecisionRecord {
  node_id: string;
  option_id: string;
  branch_key: string;
  turn_index: number;
  timestamp: string;
  state_before: AgentState;
  state_after: AgentState;
  rationale?: string;
}

export interface Session {
  session_id: string;
  case_id: string;
  created_at: string;
  turn: number;
  node_index: number;
  branch_keys: string[];
  turns_since_node: number;
  agent: AgentRuntime;
  decisions: DecisionRecord[];
  state_history: { turn: number; state: AgentState }[];
  finished: boolean;
}

// ---------- Evaluation ----------
export interface ReflectionReport {
  session_id: string;
  case_title: string;
  path: {
    node_prompt: string;
    chosen: string;
    protects: PrincipleId[];
    sacrifices: PrincipleId[];
    consequences: string[];
    rationale?: string;
  }[];
  value_profile: { principle: PrincipleId; protected: number; sacrificed: number }[];
  state_trajectory: { turn: number; state: AgentState }[];
  value_conflicts: EthicsAnalysis["value_conflicts"];
  perspectives: { stance: string; argument: string }[];
  uncertainty: string[];
  reflection_questions: string[];
  narrative?: string;
  generated_by: string;
  disclaimer: string;
}

// ---------- Research log ----------
export interface ResearchEvent {
  experiment_id: string;
  session_id: string;
  timestamp: string;
  type: "session_start" | "user_message" | "agent_response" | "decision" | "reflection";
  model: string;
  model_version: string;
  prompt_version: string;
  case_id: string;
  case_version: string;
  params: Record<string, unknown>;
  payload: Record<string, unknown>;
}
