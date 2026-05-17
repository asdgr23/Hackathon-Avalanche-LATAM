// modules/graph/graph.service.ts
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { EntitiesService } from '../entities/entities.service';
import { RelationsService } from '../relations/relations.service';

@Injectable()
export class GraphService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly entities: EntitiesService,
    private readonly relations: RelationsService,
  ) {}

  async buildFromTransactions(transactions: RawTransaction[]): Promise<GraphResult> {
    // normaliza los datos crudos
    const normalized = this.normalize(transactions);

    // ruelve entidades (deduplicar por RFC/alias)
    const resolvedEntities = await this.entities.resolveAll(normalized);

    // construir relaciones y pesos
    const edges = await this.relations.buildEdges(resolvedEntities);

    // persiste en Neo4j
    await this.persistGraph(resolvedEntities, edges);

    return { nodes: resolvedEntities, edges, metadata: { count: edges.length } };
  }

  private normalize(raw: RawTransaction[]) {
    return raw.map(t => ({
      ...t,
      rfc: t.rfc?.toUpperCase().trim(),
      amount: Number(t.amount),
      date: new Date(t.date),
    }));
  }

  private async persistGraph(entities: ResolvedEntity[], edges: GraphEdge[]) {
    const session = this.neo4j.getWriteSession();
    try {
      for (const entity of entities) {
        await session.run(
          `MERGE (e:Entity {id: $id})
           SET e += $props`,
          { id: entity.id, props: entity },
        );
      }
      for (const edge of edges) {
        await session.run(
          `MATCH (a:Entity {id: $from}), (b:Entity {id: $to})
           MERGE (a)-[r:CONNECTED {type: $type}]->(b)
           SET r.weight = $weight, r.lastSeen = $date`,
          edge,
        );
      }
    } finally {
      await session.close();
    }
  }
}