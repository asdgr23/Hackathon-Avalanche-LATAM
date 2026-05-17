import { Injectable } from '@nestjs/common';

// modules/relations/relations.service.ts
@Injectable()
export class RelationsService {
  buildEdges(entities: ResolvedEntity[]): GraphEdge[] {
    const edges: GraphEdge[] = [];

    // Conexiones explícitas: A pagó a B
    for (const tx of this.extractTransactions(entities)) {
      edges.push({
        from: tx.senderId,
        to: tx.receiverId,
        type: 'TRANSACTED_WITH',
        weight: this.calcWeight(tx.amount, tx.frequency),
        date: tx.date,
      });
    }

    // Conexiones implícitas: misma dirección fiscal → posible shell company
    const byAddress = this.groupBy(entities, e => e.fiscalAddress);
    for (const [, group] of byAddress) {
      if (group.length > 1) {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            edges.push({
              from: group[i].id,
              to: group[j].id,
              type: 'SHARES_ADDRESS',
              weight: 0.6,  // peso medio — sospechoso pero no definitivo
              date: new Date(),
            });
          }
        }
      }
    }

    return edges;
  }

  // Peso = función del monto y la frecuencia (0.0 → 1.0)
  private calcWeight(amount: number, frequency: number): number {
    const amountScore = Math.min(amount / 1_000_000, 1);
    const freqScore = Math.min(frequency / 100, 1);
    return Number(((amountScore * 0.7) + (freqScore * 0.3)).toFixed(3));
  }

  private groupBy<T>(arr: T[], key: (item: T) => string) {
    return arr.reduce((map, item) => {
      const k = key(item);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(item);
      return map;
    }, new Map<string, T[]>());
  }
}
