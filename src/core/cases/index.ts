import type { EthicsCase } from "../schemas";
import { minorViolenceCase } from "./minor-violence";
import { elderDementiaCase } from "./elder-dementia";
import { psychMedicationCase } from "./psych-medication";
import { suicideRiskCase } from "./suicide-risk";
import { terminalIllnessCase } from "./terminal-illness";
import { homelessShelterCase } from "./homeless-shelter";
import { aidAllocationCase } from "./aid-allocation";
import { dualRelationshipCase } from "./dual-relationship";
import { migrantWorkerCase } from "./migrant-worker";
import { ipvAdultCase } from "./ipv-adult";
import { funderDataCase } from "./funder-data";

const registry: EthicsCase[] = [
  minorViolenceCase,
  elderDementiaCase,
  psychMedicationCase,
  suicideRiskCase,
  terminalIllnessCase,
  homelessShelterCase,
  aidAllocationCase,
  dualRelationshipCase,
  migrantWorkerCase,
  ipvAdultCase,
  funderDataCase,
];

export function listCases(): EthicsCase[] {
  return registry;
}

export function getCase(id: string): EthicsCase | undefined {
  return registry.find((c) => c.case_id === id);
}

/** 面向客户端的摘要：不暴露决策选项的价值标注，避免"看答案"。 */
export function toPublicSummary(c: EthicsCase) {
  return {
    case_id: c.case_id,
    title: c.title,
    domain: c.domain,
    population: c.population,
    setting: c.setting,
    difficulty: c.difficulty,
    risk_level: c.risk_level,
    stakeholders: c.stakeholders,
    initial_state: c.initial_state,
    human_in_the_loop_required: c.human_in_the_loop_required,
    synthetic: c.synthetic,
    ethical_conflicts_count: c.ethical_conflicts.length,
  };
}
