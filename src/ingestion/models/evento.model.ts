export interface Event {
  event_id: string;

  source: 'BANK' | 'ERP' | 'SAT' | 'CONTRACT';

  type:
    | 'BANK_TX'
    | 'ERP_INVOICE'
    | 'SAT_ENTITY'
    | 'CONTRACT';

  from_entity: string | null;
  to_entity: string | null;

  amount: number | null;

  currency?: string | null;

  timestamp: string | null;

  reference_id?: string | null; // invoice_ref, tx_id, etc.

  metadata?: Record<string, any>;

  ingested_at: string;
}