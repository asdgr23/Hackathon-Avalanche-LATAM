import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { ResolveEntityDto } from './dto/resolve-entity.dto';

// tipos internos
export interface NormalizedItem {
  name: string;
  rfc?: string;
  amount?: number;
  fiscalAddress?: string;
}

export interface ResolvedEntity {
  id: string;
  canonicalName: string;
  aliases: string[];
  type: 'person' | 'company' | 'account';
  rfc?: string;
  transactionCount: number;
  totalAmount: number;
  fiscalAddress?: string;
}

@Injectable()
export class EntitiesService {
  constructor(private readonly neo4j: Neo4jService) {}

  // público: usado por GraphService
  async resolveAll(items: NormalizedItem[]): Promise<ResolvedEntity[]> {
    const entityMap = new Map<string, ResolvedEntity>();

    for (const item of items) {
      const key = item.rfc ?? this.fingerprintByName(item.name);

      if (entityMap.has(key)) {
        const existing = entityMap.get(key)!;
        if (!existing.aliases.includes(item.name)) {
          existing.aliases.push(item.name);
        }
        existing.transactionCount += 1;
        existing.totalAmount += item.amount ?? 0;
      } else {
        entityMap.set(key, {
          id:               key,
          canonicalName:    item.name,
          aliases:          [item.name],
          type:             this.classifyEntity(item),
          rfc:              item.rfc,
          transactionCount: 1,
          totalAmount:      item.amount ?? 0,
          fiscalAddress:    item.fiscalAddress,
        });
      }
    }

    const resolved = Array.from(entityMap.values());
    await this.persistAll(resolved);   // ← persiste en Neo4j
    return resolved;
  }

  // público: usado por el controller 
  async resolveSingle(dto: ResolveEntityDto): Promise<ResolvedEntity> {
    const key = dto.rfc ?? this.fingerprintByName(dto.name);

    const entity: ResolvedEntity = {
      id:               key,
      canonicalName:    dto.name,
      aliases:          dto.aliases ?? [dto.name],
      type:             dto.type ?? this.classifyEntity({ rfc: dto.rfc, name: dto.name }),
      rfc:              dto.rfc,
      transactionCount: 1,
      totalAmount:      0,
      fiscalAddress:    dto.fiscalAddress,
    };

    await this.persistOne(entity);
    return entity;
  }

  async findById(id: string): Promise<ResolvedEntity | null> {
    const result = await this.neo4j.read(
      `MATCH (e:Entity {id: $id}) RETURN e`,
      { id },
    );

    if (result.records.length === 0) return null;

    const props = result.records[0].get('e').properties;
    return {
      ...props,
      aliases:          JSON.parse(props.aliases ?? '[]'),
      transactionCount: props.transactionCount?.toNumber() ?? 0,
      totalAmount:      props.totalAmount ?? 0,
    };
  }

  async getNeighbors(id: string) {
    const result = await this.neo4j.read(
      `MATCH (e:Entity {id: $id})-[r]->(neighbor:Entity)
       RETURN neighbor, type(r) AS relation, r.weight AS weight
       ORDER BY r.weight DESC
       LIMIT 50`,
      { id },
    );

    return result.records.map(record => ({
      entity: {
        ...record.get('neighbor').properties,
        aliases: JSON.parse(record.get('neighbor').properties.aliases ?? '[]'),
      } as ResolvedEntity,
      relation: record.get('relation') as string,
      weight:   record.get('weight')   ?? 0,
    }));
  }

  // ── privados ──────────────────────────────────────────────────

  private async persistAll(entities: ResolvedEntity[]): Promise<void> {
    const session = this.neo4j.getWriteSession();
    try {
      for (const entity of entities) {
        await this.persistOne(entity, session);
      }
    } finally {
      await session.close();
    }
  }

  private async persistOne(entity: ResolvedEntity, session?: any): Promise<void> {
    const s         = session ?? this.neo4j.getWriteSession();
    const ownSession = !session;
    try {
      await s.run(
        `MERGE (e:Entity {id: $id})
         SET e.canonicalName    = $canonicalName,
             e.aliases          = $aliases,
             e.type             = $type,
             e.rfc              = $rfc,
             e.transactionCount = coalesce(e.transactionCount, 0) + $transactionCount,
             e.totalAmount      = coalesce(e.totalAmount, 0)      + $totalAmount,
             e.fiscalAddress    = $fiscalAddress,
             e.updatedAt        = timestamp()`,
        {
          id:               entity.id,
          canonicalName:    entity.canonicalName,
          aliases:          JSON.stringify(entity.aliases),
          type:             entity.type,
          rfc:              entity.rfc          ?? null,
          transactionCount: entity.transactionCount,
          totalAmount:      entity.totalAmount,
          fiscalAddress:    entity.fiscalAddress ?? null,
        },
      );
    } finally {
      if (ownSession) await s.close();
    }
  }

  private fingerprintByName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\b(sa|de|srl|cv|sapi|s\.a\.b)\b/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  private classifyEntity(item: Pick<NormalizedItem, 'rfc' | 'name'>): 'person' | 'company' | 'account' {
    if (item.rfc?.length === 13) return 'person';
    if (item.rfc?.length === 12) return 'company';
    return 'account';
  }
}