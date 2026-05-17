import { CanonicalNormalizedEvent } from '../types/normalized';
export type IngestedEvent = {
  source: 'SAT' | 'ERP' | 'BANK' | 'CONTRACT';

  raw: any;

  normalized: CanonicalNormalizedEvent;

  from_entity: string;

  to_entity: string;

  event_id: string;

  ingested_at: string;
};