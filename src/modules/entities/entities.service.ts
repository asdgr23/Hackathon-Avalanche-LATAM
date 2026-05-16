import { Injectable } from '@nestjs/common';


@Injectable()
export class EntitiesService {
  constructor(private readonly neo4j: Neo4jService) {}

  async resolveAll(items: NormalizedItem[]): Promise<ResolvedEntity[]> {
    const entityMap = new Map<string, ResolvedEntity>();

    for (const item of items) {
      // resolución por RFC
      const key = item.rfc ?? this.fingerprintByName(item.name);

      if (entityMap.has(key)) {
        // entidad existente → merge de propiedades
        const existing = entityMap.get(key)!;
        existing.aliases.push(item.name);
        existing.transactionCount += 1;
        existing.totalAmount += item.amount ?? 0;
      } else {
        entityMap.set(key, {
          id: key,
          canonicalName: item.name,
          aliases: [item.name],
          type: this.classifyEntity(item),
          rfc: item.rfc,
          transactionCount: 1,
          totalAmount: item.amount ?? 0,
        });
      }
    }

    return Array.from(entityMap.values());
  }

  // normaliza el nombre para fingerprinting (sin stopwords, lowercase)
  private fingerprintByName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\b(sa|de|srl|cv|sapi|s\.a\.b)\b/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  private classifyEntity(item: NormalizedItem): 'person' | 'company' | 'account' {
    if (item.rfc?.length === 13) return 'person';
    if (item.rfc?.length === 12) return 'company';
    return 'account';
  }
}
