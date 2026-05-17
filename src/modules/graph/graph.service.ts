import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';

@Injectable()
export class GraphService {
  constructor(private readonly neo4j: Neo4jService) {}

  async build(events: any[]) {
    const session = this.neo4j.getWriteSession();

    try {
      // filtrar eventos válidos
      const valid = events.filter(
        (e) =>
          e?.raw?.from_entity &&
          e?.raw?.to_entity &&
          e?.raw?.event_id,
      );

      let tx = session.beginTransaction();

      for (let i = 0; i < valid.length; i++) {
        const event = valid[i];

        const normalized = event.raw.normalized;

        await tx.run(
          `
          MERGE (from:Entity {id: $from})
          ON CREATE SET
            from.created_at = datetime()

          MERGE (to:Entity {id: $to})
          ON CREATE SET
            to.created_at = datetime()

          MERGE (from)-[r:TRANSACTED {event_id: $event_id}]->(to)

          SET
            r.amount = $amount,
            r.currency = $currency,
            r.timestamp = $timestamp,
            r.source = $source,
            r.type = $type,
            r.updated_at = datetime()
          `,
          {
            from: event.raw.from_entity,
            to: event.raw.to_entity,
            event_id: event.raw.event_id,

            amount: normalized?.amount ?? null,
            currency: normalized?.currency ?? null,
            timestamp:
              normalized?.timestamp ??
              event.raw.ingested_at ??
              null,

            source: normalized?.source ?? event.source ?? 'UNKNOWN',
            type: normalized?.type ?? 'UNKNOWN',
          },
        );

        // batch commits para datasets grandes
        if (i > 0 && i % 500 === 0) {
          await tx.commit();

          console.log(`Committed ${i} events`);

          tx = session.beginTransaction();
        }
      }

      // commit final
      await tx.commit();

      return {
        status: 'graph built',
        count: valid.length,
      };
    } catch (err) {
      console.error(err);

      throw err;
    } finally {
      await session.close();
    }
  }
}