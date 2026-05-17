export type AMLFlag =
  | "smurfing"
  | "structuring"
  | "circular_flow"
  | "velocity_anomaly"
  | "concentration_risk"
  | "watchlist_match"
  | "layering"
  | "rapid_movement"
  | "tax_mismatch";

export interface GraphSummary {
  node_count: number;

  edge_count: number;

  connected_entities: string[];

  detected_cycles?: string[][];

  high_degree_nodes?: string[];

  avg_transaction_amount?: number;

  transaction_count: number;

  time_window_days: number;
}

export interface TransactionMetadata {
  total_volume_usd?: number;

  max_single_transaction_usd?: number;

  jurisdictions_involved?: string[];

  peak_activity_period?: string;
}

export interface AMLOutput {
  entity_id: string;

  entity_name?: string;

  risk_score: number;

  flags: AMLFlag[];

  graph_summary: GraphSummary;

  metadata?: TransactionMetadata;
}

export interface AgentReport {
  entity_id: string;

  risk_level:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  risk_score: number;

  report: string;

  generated_at: string;

  flags_detected: AMLFlag[];
}