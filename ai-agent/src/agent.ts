import OpenAI from "openai";

import dotenv from "dotenv";

import { SYSTEM_PROMPT } from "./prompts";

import {
  AMLOutput,
  AgentReport,
} from "./types";

dotenv.config();

// ─────────────────────────────────────────────
// GROQ CLIENT
// ─────────────────────────────────────────────

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});

// ─────────────────────────────────────────────
// RISK LEVEL HELPER
// ─────────────────────────────────────────────

function getRiskLevel(
  score: number
): AgentReport["risk_level"] {

  if (score >= 0.85) {
    return "CRITICAL";
  }

  if (score >= 0.65) {
    return "HIGH";
  }

  if (score >= 0.40) {
    return "MEDIUM";
  }

  return "LOW";
}

// ─────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────

function buildUserPrompt(
  input: AMLOutput
): string {

  const riskLevel =
    getRiskLevel(input.risk_score);

  const flagsText =
    input.flags.length > 0
      ? input.flags.join(", ")
      : "No flags detected";

  const cyclesText =
    input.graph_summary.detected_cycles?.length
      ? input.graph_summary.detected_cycles
          .map((cycle) =>
            cycle.join(" → ")
          )
          .join("\n")
      : "No circular flows detected";

  const hubNodes =
    input.graph_summary.high_degree_nodes
      ?.join(", ")
      || "No hub nodes identified";

  return `
Generate a formal AML investigation report.

ENTITY INFORMATION:
- Entity ID: ${input.entity_id}
- Entity Name:
${input.entity_name || "Unknown"}

RISK ASSESSMENT:
- Risk Score: ${input.risk_score}
- Risk Level: ${riskLevel}

FLAGS DETECTED:
${flagsText}

GRAPH ANALYSIS:
- Node Count:
${input.graph_summary.node_count}

- Edge Count:
${input.graph_summary.edge_count}

- Transaction Count:
${input.graph_summary.transaction_count}

- Analysis Window:
${input.graph_summary.time_window_days} days

CONNECTED ENTITIES:
${input.graph_summary.connected_entities.join(", ")}

DETECTED CYCLES:
${cyclesText}

HIGH DEGREE NODES:
${hubNodes}

AVERAGE TRANSACTION AMOUNT:
${input.graph_summary.avg_transaction_amount || "Unknown"}

TRANSACTION METADATA:

- Total Volume USD:
${input.metadata?.total_volume_usd || "Unknown"}

- Largest Transaction USD:
${input.metadata?.max_single_transaction_usd || "Unknown"}

- Jurisdictions:
${
  input.metadata?.jurisdictions_involved?.join(", ")
  || "Unknown"
}

- Peak Activity Period:
${input.metadata?.peak_activity_period || "Unknown"}

Use the exact response structure from the system prompt.

Reference specific data points.

Do not speculate beyond the provided data.
`;
}

// ─────────────────────────────────────────────
// MAIN AI AGENT FUNCTION
// ─────────────────────────────────────────────

export async function generateReport(
  amlOutput: AMLOutput
): Promise<AgentReport> {

  const startTime = Date.now();

  const userPrompt =
    buildUserPrompt(amlOutput);

  const response =
    await client.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",

          content: SYSTEM_PROMPT,
        },

        {
          role: "user",

          content: userPrompt,
        },
      ],

      temperature: 0.2,

      max_tokens: 1200,
    });

  const reportText =
    response.choices[0]
      ?.message
      ?.content
    || "No report generated";

  const elapsedMs =
    Date.now() - startTime;

  console.log(
    `AML report generated in ${elapsedMs}ms`
  );

  return {
    entity_id: amlOutput.entity_id,

    risk_level: getRiskLevel(
      amlOutput.risk_score
    ),

    risk_score: amlOutput.risk_score,

    report: reportText,

    generated_at:
      new Date().toISOString(),

    flags_detected:
      amlOutput.flags,
  };
}