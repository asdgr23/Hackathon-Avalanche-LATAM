// types/canonical-normalized-event.ts

export type CanonicalNormalizedEvent = {
  type: 'transfer' | 'invoice' | 'contract' | 'payment';

  tx_id: string;

  amount: number | null;

  currency: string;

  timestamp: string | null;

  from: string | null;

  to: string | null;

  source: 'SAT' | 'ERP' | 'BANK' | 'CONTRACT';
};