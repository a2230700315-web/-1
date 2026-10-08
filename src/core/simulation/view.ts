import { getCase } from "../cases";
import { STATE_LABELS } from "../agents/state";
import { PRINCIPLES } from "../ethics";
import type { Session } from "../schemas";
import { currentNode, decisionFrame, decisionReady } from "./engine";

/** 面向前端的会话视图：决策选项只暴露文字，不暴露价值标注。 */
export function sessionView(s: Session) {
  const c = getCase(s.case_id)!;
  const node = currentNode(c, s);
  const ready = decisionReady(c, s);
  return {
    session_id: s.session_id,
    case_id: c.case_id,
    title: c.title,
    scene: c.initial_state,
    client_name: s.agent.profile.name,
    transcript: s.agent.memory,
    state: s.agent.state,
    state_labels: STATE_LABELS,
    finished: s.finished,
    // 决策是否“可进入”。前端不会自动弹出，由学生点击“进入决策”后才展示。
    decision_gate: node
      ? { available: ready, turns_since_node: s.turns_since_node, min_turns: node.minTurns, low_disclosure: s.agent.state.willingness_to_disclose < (node.disclosureThreshold ?? 40) }
      : null,
    decision:
      node && ready
        ? (() => {
            const f = decisionFrame(node, s);
            return {
              node_id: node.id,
              narration: f.narration,
              prompt: f.prompt,
              low_disclosure: f.low_disclosure,
              options: node.options.map((o) => ({ id: o.id, label: o.label, description: o.description })),
            };
          })()
        : null,
    progress: { node_index: s.node_index, total_nodes: c.decision_nodes.length },
    human_in_the_loop_required: c.human_in_the_loop_required,
    hitl_notice: c.hitl_notice,
    suggested_prompts: c.suggested_prompts,
  };
}

export function principleLabels() {
  return Object.fromEntries(Object.values(PRINCIPLES).map((p) => [p.id, p.label]));
}
