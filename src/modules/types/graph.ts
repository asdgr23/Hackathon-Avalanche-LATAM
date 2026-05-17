import { GraphNodeRef } from "./node";
import { GraphRelationship } from "./relationship";

export type GraphEvent = {
  type: 'TRANSFER' | 'INVOICE_PAYMENT' | 'CONTRACT_FLOW';

  amount: number;
  currency: string;
  timestamp: string;

  from: GraphNodeRef;
  to: GraphNodeRef;

  relationship: GraphRelationship;

  source: string;

  risk?: {
    score: number;
    flags: string[];
  };
};