export class AmlResponseDto {
  entity_id: string;
  aml_risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';

  flags: string[];
  exposed_entities: string[];
}