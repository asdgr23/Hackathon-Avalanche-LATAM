import { Injectable } from '@nestjs/common';
import { ResolvedEntity } from '../types/resolved-entity';
import { GraphEdge } from '../types/edge';
import { EntityTransaction as GraphTransaction } from '../types/entity-transaction';

@Injectable()
export class RelationsService {

  buildEdges(
    entities: ResolvedEntity[],
    transactions: GraphTransaction[],
  ): GraphEdge[] {

    const edges: GraphEdge[] = [];

    // =========================
    // EXPLICIT CONNECTIONS (MONEY FLOW)
    // =========================

    for (const tx of transactions) {
      edges.push({
        from: tx.from,
        to: tx.to,
        type: 'TRANSACTED_WITH',
        weight: this.calcWeight(tx.amount, tx.frequency ?? 1),
        date: tx.timestamp,
      });
    }

    // =========================
    // IMPLICIT CONNECTIONS (GRAPH PATTERNS)
    // =========================

    const byAddress = this.groupBy(
      entities,
      e => e.fiscalAddress ?? 'unknown',
    );

    for (const [, group] of byAddress) {
      if (group.length > 1) {

        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {

            edges.push({
              from: group[i].entity_id,
              to: group[j].entity_id,
              type: 'SHARES_ADDRESS',
              weight: 0.6,
              date: new Date().toISOString(),
            });

          }
        }

      }
    }

    return edges;
  }

  // =========================
  // EDGE WEIGHT (AML SCORING BASIC)
  // =========================

  private calcWeight(amount: number, frequency: number): number {
    const amountScore = Math.min(amount / 1_000_000, 1);
    const freqScore = Math.min(frequency / 100, 1);

    return Number(
      ((amountScore * 0.7) + (freqScore * 0.3)).toFixed(3),
    );
  }

  // =========================
  // GROUPING UTILITY
  // =========================

  private groupBy<T>(
    arr: T[],
    key: (item: T) => string,
  ): Map<string, T[]> {

    return arr.reduce((map, item) => {
      const k = key(item);

      if (!map.has(k)) {
        map.set(k, []);
      }

      map.get(k)!.push(item);

      return map;

    }, new Map<string, T[]>());
  }

  // =========================
  // OPTIONAL API HELPERS
  // =========================

  createEdge(dto: any) {
    return {
      message: 'edge created',
      dto,
    };
  }

  findPath(query: any) {
    return {
      message: 'path found',
      query,
    };
  }

  detectImplicitConnections() {
    return {
      message: 'implicit connections detected',
    };
  }
}
