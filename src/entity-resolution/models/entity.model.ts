export interface Entity {
  entity_id: string;

  type: 'PERSON' | 'COMPANY' | 'UNKNOWN';
  
  canonical_name: string | null;

  normalized_name: string;

  rfcs: string[];
  accounts: string[];

  aliases: string[];

  created_at: string;
}