import { AgentReport } from "../types";

export function buildAvalanchePayload(

  report: AgentReport

) {

  return {

    entity_id:
      report.entity_id,

    risk_level:
      report.risk_level,

    risk_score:
      report.risk_score,

    flags:
      report.flags_detected,

    generated_at:
      report.generated_at,

    compliance_status:

      report.risk_level === "HIGH"
      ||
      report.risk_level === "CRITICAL"

        ? "REVIEW_REQUIRED"

        : "MONITOR",

    blockchain_ready: true,
  };
}