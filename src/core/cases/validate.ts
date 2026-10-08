import type { EthicsCase, PrincipleId, StateKey } from "../schemas";

const PRINCIPLE_IDS: PrincipleId[] = [
  "confidentiality",
  "autonomy",
  "safety",
  "minimize_harm",
  "professional_responsibility",
  "family_relationship",
  "professional_boundary",
  "justice",
  "client_best_interest",
];
const STATE_KEYS: StateKey[] = ["trust", "fear", "anger", "willingness_to_disclose", "risk_level", "dependency", "relationship_quality"];

const nonEmpty = (v: unknown) => typeof v === "string" && v.trim().length > 0;

/**
 * 案例质量守卫：返回错误列表，空数组表示通过。
 * 只检查结构与硬性原则（不虚构法条、必须标注价值冲突、不设唯一正确答案），不评价文笔。
 */
export function validateCase(c: EthicsCase): string[] {
  const e: string[] = [];
  const need = (ok: boolean, msg: string) => {
    if (!ok) e.push(msg);
  };

  need(/^[a-z0-9]+(-[a-z0-9]+)+$/.test(c.case_id), "case_id 需为 kebab-case，如 elder-care-autonomy-v1");
  for (const k of ["version", "title", "domain", "population", "setting", "initial_state", "opening_line", "hitl_notice"] as const) need(nonEmpty(c[k]), `${k} 不能为空`);
  need(c.synthetic === true, "synthetic 必须为 true（仅允许合成数据）");
  need([1, 2, 3, 4, 5].includes(c.difficulty), "difficulty 需为 1-5");
  need(["low", "medium", "high"].includes(c.risk_level), "risk_level 非法");
  need(c.information_completeness >= 0 && c.information_completeness <= 1, "information_completeness 需在 0-1");

  need(c.ethical_conflicts.length >= 2, "ethical_conflicts 至少 2 组");
  for (const x of c.ethical_conflicts) {
    need(PRINCIPLE_IDS.includes(x.between[0]) && PRINCIPLE_IDS.includes(x.between[1]), `冲突含未知原则：${x.between}`);
    need(x.between[0] !== x.between[1], "冲突的两端不能相同");
    need(nonEmpty(x.note), "冲突需有 note");
  }
  need(c.stakeholders.length >= 4, "stakeholders 至少 4 个");
  need(c.institutional_constraints.length >= 2, "institutional_constraints 至少 2 条");
  need(c.client_preferences.length >= 1, "client_preferences 至少 1 条");
  need(c.possible_outcomes.length >= 3, "possible_outcomes 至少 3 条");

  // 服务对象
  const a = c.client_agent;
  need(a.role === "client", "client_agent.role 必须为 client");
  for (const k of ["name", "background", "decision_policy"] as const) need(nonEmpty(a[k]), `client_agent.${k} 不能为空`);
  for (const k of ["personality", "goals", "fears", "values"] as const) need(a[k].length >= 2, `client_agent.${k} 至少 2 项`);
  need(a.knowledge.knows.length >= 2 && a.knowledge.does_not_know.length >= 2, "knowledge.knows / does_not_know 各至少 2 项（知识边界）");
  for (const k of STATE_KEYS) need(c.initial_client_state[k] >= 0 && c.initial_client_state[k] <= 100, `initial_client_state.${k} 需在 0-100`);

  // 决策流程
  need(c.decision_nodes.length >= 2, "decision_nodes 至少 2 个");
  c.decision_nodes.forEach((n, ni) => {
    const where = `节点${n.id}`;
    need(n.minTurns >= 3 && n.minTurns <= 6, `${where}.minTurns 需在 3-6（避免决策过早出现）`);
    need(nonEmpty(n.prompt), `${where}.prompt 不能为空`);
    need(nonEmpty(n.narrationByBranch.default), `${where}.narrationByBranch.default 必须有`);
    if (ni === 0) need(nonEmpty(n.lowDisclosureNarration) && nonEmpty(n.lowDisclosurePrompt), `${where}（首个节点）必须提供 lowDisclosureNarration / lowDisclosurePrompt：学生没建立信任时，决策应在信息不完整下作出`);
    need(n.options.length >= 3 && n.options.length <= 4, `${where} 选项需 3-4 个`);
    const ids = new Set(n.options.map((o) => o.id));
    need(ids.size === n.options.length, `${where} 选项 id 重复`);
    const branchKeys = new Set(n.options.map((o) => o.branchKey));
    need(branchKeys.size === n.options.length, `${where} branchKey 必须互不相同`);
    const protectSets = new Set(n.options.map((o) => [...o.protects].sort().join("|")));
    need(protectSets.size >= 2, `${where} 各选项保护的价值不应完全相同（否则就没有价值冲突）`);

    for (const o of n.options) {
      const w = `${where}/${o.id}`;
      need(o.id.startsWith(n.id + "-"), `${w} id 需以 "${n.id}-" 开头`);
      need(nonEmpty(o.label) && nonEmpty(o.description) && nonEmpty(o.outcomeNarration), `${w} label/description/outcomeNarration 不能为空`);
      need(o.protects.length >= 1, `${w} 必须标注至少 1 个 protects`);
      need(o.sacrifices.length >= 1, `${w} 必须标注至少 1 个 sacrifices（每个选择都有代价，不设唯一正确答案）`);
      for (const p of [...o.protects, ...o.sacrifices]) need(PRINCIPLE_IDS.includes(p), `${w} 含未知原则 ${p}`);
      need(o.protects.every((p) => !o.sacrifices.includes(p)), `${w} 同一原则不能同时出现在 protects 与 sacrifices`);
      need(o.consequences.length >= 3, `${w} consequences 至少 3 条（含不确定性）`);
      need(o.effects.length >= 2, `${w} effects 至少 2 项`);
      for (const f of o.effects) {
        need(STATE_KEYS.includes(f.key), `${w} effects 含未知状态 ${f.key}`);
        need(Number.isInteger(f.delta) && Math.abs(f.delta) <= 30 && f.delta !== 0, `${w} effects.delta 需为 1-30 的非零整数`);
        need(nonEmpty(f.reason), `${w} effects 必须带 reason（可解释）`);
      }
    }
    if (ni > 0) {
      const prev = c.decision_nodes[ni - 1];
      for (const o of prev.options) need(nonEmpty(n.narrationByBranch[o.branchKey]), `${where}.narrationByBranch 缺少上一节点分支 "${o.branchKey}"`);
    }
  });

  // 提示语与反思
  need(c.suggested_prompts.length === 4 && c.suggested_prompts.every(nonEmpty), "suggested_prompts 需恰好 4 条");
  need(c.reflection_questions.length >= 4 && c.reflection_questions.length <= 5, "reflection_questions 需 4-5 条");
  need(c.uncertainties.length >= 2, "uncertainties 至少 2 条");
  const tr = c.topic_replies ?? [];
  need(tr.length >= 6, "topic_replies 至少 6 条（离线演示用）");
  for (const t of tr) {
    try {
      new RegExp(t.pattern);
    } catch {
      e.push(`topic_replies 含非法正则：${t.pattern}`);
    }
    need(nonEmpty(t.reply), "topic_replies.reply 不能为空");
  }

  // 知识来源：不得虚构
  need(c.knowledge_sources.length >= 1, "knowledge_sources 至少 1 条（占位说明即可）");
  for (const k of c.knowledge_sources) need(k.verified === false, "未经核对的 knowledge_sources 必须 verified:false");

  // 不得编造具体法条/文号/文献
  const text = JSON.stringify(c);
  const fabricated = text.match(/第[零一二三四五六七八九十百千\d]+条|《[^》]{2,30}(法|条例|规定|办法|准则|守则)》|\d{4}年第\d+号|DOI|doi:/g);
  need(!fabricated, `案例中不得写具体法条、法规名称或文号（会被当成权威引用）：${fabricated?.slice(0, 3).join(" / ")}`);

  return e;
}
