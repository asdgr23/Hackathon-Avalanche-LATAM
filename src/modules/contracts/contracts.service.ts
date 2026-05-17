import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { CreateContractDto } from './dto/create-contracts.dto';
import { QueryContractDto } from './dto/query-contracts.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly neo4j: Neo4jService) {}

  async create(dto: CreateContractDto) {
    const session = this.neo4j.getWriteSession();
    try {
      // Crea un nodo Contract y conecta a TODAS las partes
      // Si son A, B, C → A-CONTRACTED_WITH-B, A-CONTRACTED_WITH-C, B-CONTRACTED_WITH-C
      await session.run(
        `MERGE (c:Contract {contractId: $contractId})
         SET c += $props`,
        { contractId: dto.contractId, props: { ...dto, partiesRfc: dto.partiesRfc.join(',') } },
      );

      // Itera todos los pares de firmantes y crea relaciones bidireccionales
      for (let i = 0; i < dto.partiesRfc.length; i++) {
        for (let j = i + 1; j < dto.partiesRfc.length; j++) {
          await session.run(
            `MERGE (a:Entity {id: $rfcA}) SET a.name = $nameA, a.rfc = $rfcA
             MERGE (b:Entity {id: $rfcB}) SET b.name = $nameB, b.rfc = $rfcB
             MERGE (a)-[r:CONTRACTED_WITH {contractId: $contractId}]->(b)
             SET r.type       = $type,
                 r.value      = $value,
                 r.status     = $status,
                 r.startDate  = $startDate,
                 r.weight     = $weight`,
            {
              rfcA:       dto.partiesRfc[i],
              nameA:      dto.partiesName[i] ?? dto.partiesRfc[i],
              rfcB:       dto.partiesRfc[j],
              nameB:      dto.partiesName[j] ?? dto.partiesRfc[j],
              contractId: dto.contractId,
              type:       dto.type,
              value:      dto.value,
              status:     dto.status,
              startDate:  dto.startDate,
              weight:     this.calcWeight(dto.value, dto.status),
            },
          );
        }
      }

      return { ok: true, contractId: dto.contractId, edges: this.pairCount(dto.partiesRfc.length) };
    } finally {
      await session.close();
    }
  }

  async findByParty(query: QueryContractDto) {
    const result = await this.neo4j.read(
      `MATCH (a:Entity)-[r:CONTRACTED_WITH]->(b:Entity)
       WHERE ($rfcParty IS NULL OR a.rfc = $rfcParty OR b.rfc = $rfcParty)
         AND ($type     IS NULL OR r.type   = $type)
         AND ($status   IS NULL OR r.status = $status)
       RETURN a, r, b
       ORDER BY r.startDate DESC
       LIMIT 100`,
      {
        rfcParty: query.rfcParty ?? null,
        type:     query.type     ?? null,
        status:   query.status   ?? null,
      },
    );
    return result.records.map(r => ({
      partyA:   r.get('a').properties,
      partyB:   r.get('b').properties,
      contract: r.get('r').properties,
    }));
  }

  // Detecta entidades que comparten contrato Y facturas → señal de relación muy estrecha
  async detectSharedActivity() {
    const result = await this.neo4j.read(
      `MATCH (a:Entity)-[:CONTRACTED_WITH]->(b:Entity)
       MATCH (a)-[:INVOICED_BY]->(b)
       RETURN a.id AS rfcA, b.id AS rfcB,
              count(*) AS sharedLinks`,
    );
    return result.records.map(r => ({
      rfcA:        r.get('rfcA'),
      rfcB:        r.get('rfcB'),
      sharedLinks: r.get('sharedLinks').toNumber(),
    }));
  }

  private calcWeight(value: number, status?: string): number {
    const base = Math.min(value / 10_000_000, 1);
    const multiplier = status === 'DISPUTED' ? 1.2 : 1.0;
    return Number(Math.min(base * multiplier, 1).toFixed(3));
  }

  private pairCount(n: number): number {
    return (n * (n - 1)) / 2;
  }
}