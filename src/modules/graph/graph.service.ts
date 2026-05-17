import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';

@Injectable()
export class GraphService {
  constructor(private readonly neo4j: Neo4jService) {}

  async build(events: any[]) {
    const session = this.neo4j.getWriteSession();

    try {
      for (const event of events) {
        await this.createGraph(session, event);
      }

      return {
        status: 'graph built',
        count: events.length,
      };
    } finally {
      await session.close();
    }
  }

  private async createGraph(session: any, event: any) {
    await session.run(
      `
      MERGE (from:Entity {id: $from})
      MERGE (to:Entity {id: $to})

      MERGE (from)-[r:TRANSACTED {
        event_id: $event_id
      }]->(to)

      SET r.amount = $amount,
          r.source = $source,
          r.timestamp = $timestamp
      `,
      {
        from: event.from_entity,
        to: event.to_entity,
        event_id: event.event_id,
        amount: event.normalized?.amount ?? null,
        source: event.source,
        timestamp: event.ingested_at,
      },
    );
  }
}