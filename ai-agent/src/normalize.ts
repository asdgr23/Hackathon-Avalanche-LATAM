// src/normalize.ts

import { detectStructuring }
from "./detections/detectStructuring";

import { detectRapidMovement }
from "./detections/detectRapidMovement";

import { detectLayering }
from "./detections/detectLayering";

import { detectInvoiceFraud }
from "./detections/detectInvoiceFraud";

import {
  AMLOutput,
  AMLFlag
} from "./types";

// ─────────────────────────────────────
// NORMALIZATION ENGINE
// ─────────────────────────────────────

export function normalizeData(
  transactions: any[],
  invoices: any[] = [],
  contracts: any[] = []
): AMLOutput {

  const flags: AMLFlag[] = [];

  // ─────────────────────────────────────
  // AML DETECTIONS
  // ─────────────────────────────────────

  if (
    detectStructuring(transactions)
  ) {
    flags.push("structuring");
  }

  if (
    detectRapidMovement(transactions)
  ) {
    flags.push("rapid_movement");
  }

  if (
    detectLayering(transactions)
  ) {
    flags.push("layering");
  }

  if (
    detectInvoiceFraud(
      invoices,
      contracts
    )
  ) {
    flags.push("concentration_risk");
  }

  // ─────────────────────────────────────
  // RISK WEIGHTS
  // ─────────────────────────────────────

  const weights: Record<
    AMLFlag,
    number
  > = {
    smurfing: 0.20,
    structuring: 0.22,
    circular_flow: 0.35,
    velocity_anomaly: 0.25,
    concentration_risk: 0.18,
    watchlist_match: 0.50,
    layering: 0.35,
    rapid_movement: 0.28,
  };

  // ─────────────────────────────────────
  // CALCULATE RISK SCORE
  // ─────────────────────────────────────

  let riskScore = 0;

  for (const flag of flags) {
    riskScore += weights[flag];
  }

  riskScore = Math.min(
    Number(riskScore.toFixed(2)),
    0.98
  );

  // ─────────────────────────────────────
  // METRICS
  // ─────────────────────────────────────

  let totalVolume = 0;

  let maxTransaction = 0;

  for (const tx of transactions) {

    const amount =
      Number(
        tx.amount ||
        tx.transaction_amount ||
        tx.value ||
        tx.usd_amount ||
        0
      );

    totalVolume += amount;

    if (amount > maxTransaction) {
      maxTransaction = amount;
    }
  }

  const avgTransaction =
    transactions.length > 0
      ? totalVolume / transactions.length
      : 0;

  // ─────────────────────────────────────
  // CONNECTED ENTITIES
  // ─────────────────────────────────────

  const connectedEntities =
    Array.from(
      new Set(
        transactions.flatMap(
          (tx) => [
            tx.sender,
            tx.receiver,
            tx.from_account,
            tx.to_account,
          ]
        )
      )
    )
    .filter(Boolean)
    .slice(0, 15);

  // ─────────────────────────────────────
  // OUTPUT
  // ─────────────────────────────────────

  return {

    entity_id: "ENTITY-001",

    entity_name:
      "Detected Financial Entity",

    risk_score: riskScore,

    flags,

    graph_summary: {

      node_count:
        connectedEntities.length,

      edge_count:
        transactions.length,

      connected_entities:
        connectedEntities,

      transaction_count:
        transactions.length,

      time_window_days: 30,

      avg_transaction_amount:
        Number(
          avgTransaction.toFixed(2)
        ),
    },

    metadata: {

      total_volume_usd:
        Number(
          totalVolume.toFixed(2)
        ),

      max_single_transaction_usd:
        Number(
          maxTransaction.toFixed(2)
        ),

      jurisdictions_involved: [
        "Panama",
        "USA",
      ],

      peak_activity_period:
        "Last 30 days",
    },
  };
}