import { Injectable } from "@nestjs/common";
import { BankTransformer } from "./transformers/bank.transformer";
import { ErpTransformer } from "./transformers/erp.transformer";
import { SatTransformer } from "./transformers/sat.transformer";
import { ContractTransformer } from "./transformers/contract.transformer";
import { EntityResolutionService } from '../entity-resolution/entity-resolution.service';

@Injectable()
export class IngestionService {
  constructor(
    private bank: BankTransformer,
    private erp: ErpTransformer,
    private sat: SatTransformer,
    private contract: ContractTransformer,
    private entityResolution: EntityResolutionService,

  ) {}

  ingest(source: 'SAT' | 'ERP' | 'BANK' | 'CONTRACT', payload: any[]) {
    return payload.map((record) => {
      const normalized = this.transform(source, record);
      const enriched = this.enrichWithEntities(source, normalized, record);

      return {
        source,
        raw: record,
        normalized,
        from_entity: enriched.from_entity,
        to_entity: enriched.to_entity,
        event_id: this.generateEventId(),
        ingested_at: new Date().toISOString(),
      };
    });
  }

  private transform(source: string, record: any) {
    switch (source) {
      case 'BANK':
        return this.bank.transform(record);

      case 'ERP':
        return this.erp.transform(record);

      case 'SAT':
        return this.sat.transform(record);

      case 'CONTRACT':
        return this.contract.transform(record);

      default:
        throw new Error('Unknown source');
    }
  }

  private enrichWithEntities(source: 'SAT' | 'ERP' | 'BANK' | 'CONTRACT', normalized: any, raw: any) {
  const fromEntity = this.entityResolution.resolve({
    name: normalized.from,
    rfc: normalized.rfc_from,
    account: raw.sender_account,
      source,

  });

  const toEntity = this.entityResolution.resolve({
    source,
    name: normalized.from ?? raw.sender_name ?? null,
    rfc: normalized.rfc_to,
    account: raw.receiver_account,
  });

  return {
    from_entity: fromEntity.entity_id,
    to_entity: toEntity.entity_id,
  };
}

  private generateEventId() {
    return `evt_${Math.random().toString(36).substring(2, 10)}`;
  }


}