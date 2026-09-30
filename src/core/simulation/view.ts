import { getCase } from "../cases";
import { STATE_LABELS } from "../agents/state";
import { PRINCIPLES } from "../ethics";
import type { Session } from "../schemas";
import { currentNode, decisionReady, nodeNarration } from "./engine";

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
    decision: node && ready
      ? {
          node_id: node.id,
          narration: nodeNarration(node, s),
          prompt: node.prompt,
          options: node.options.map((o) => ({ id: o.id, label: o.label, description: o.description })),
        }
      : null,
    progress: { node_index: s.node_index, total_nodes: c.decision_nodes.length },
    human_in_the_loop_required: c.human_in_the_loop_required,
  };
}

export function principleLabels() {
  return Object.fromEntries(Object.values(PRINCIPLES).map((p) => [p.id, p.label]));
}
