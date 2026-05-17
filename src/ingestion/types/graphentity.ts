export type GraphEntity = {
  type: 'ENTITY';

  entity_id: string;

  rfc: string | null;

  legal_name: string | null;

  trade_name: string | null;

  location?: any;

  identity_signature: string | null;

  source: 'SAT';
};