import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NameNormalizer } from './normalizers/name.normalizer';
import { EntityStoreService } from './entity-store.service';
import { Entity } from './models/entity.model';

@Injectable()
export class EntityResolutionService {
  constructor(private store: EntityStoreService) {}

  resolve(input: {
    name?: string | null;
    rfc?: string | null;
    account?: string | null;
  }) {
    // 1. RFC MATCH (más fuerte)
    if (input.rfc) {
      const byRfc = this.findByRfc(input.rfc);
      if (byRfc) return byRfc;
    }

    // 2. ACCOUNT MATCH
    if (input.account) {
      const byAccount = this.findByAccount(input.account);
      if (byAccount) return byAccount;
    }

    // 3. NAME MATCH (fuzzy simple MVP)
    const normalized = NameNormalizer.normalize(input.name);

    const byName = this.findByName(normalized);
    if (byName) return byName;

    // 4. CREATE NEW ENTITY
  const entity: Entity = {
      entity_id: randomUUID(),

      type: 'COMPANY',

      canonical_name: input.name || null,
      normalized_name: normalized,

      rfcs: input.rfc ? [input.rfc] : [],
      accounts: input.account ? [input.account] : [],

      aliases: [],

      created_at: new Date().toISOString(),
    };

    this.store.save(entity);

    return entity;
  }

  private findByRfc(rfc: string) {
    return this.store.getAll().find(e =>
      e.rfcs.includes(rfc)
    );
  }

  private findByAccount(account: string) {
    return this.store.getAll().find(e =>
      e.accounts.includes(account)
    );
  }

  private findByName(name: string) {
    return this.store.getAll().find(e =>
      e.normalized_name === name
    );
  }
}
