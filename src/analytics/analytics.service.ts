import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly neo4j: Neo4jService) {}

  async topEntities() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (a:Entity)-[r:TRANSACTED]->()
        RETURN a.id AS entity, count(r) AS transactions
        ORDER BY transactions DESC
        LIMIT 10
      `);

      return result.records.map(r => ({
        entity: r.get('entity'),
        transactions: r.get('transactions').toNumber(),
      }));
    } finally {
      await session.close();
    }
  }

  async topVolume() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (a:Entity)-[r:TRANSACTED]->()
        RETURN a.id AS entity, sum(r.amount) AS volume
        ORDER BY volume DESC
        LIMIT 10
      `);

      return result.records.map(r => ({
        entity: r.get('entity'),
volume: typeof r.get('volume')?.toNumber === 'function'
  ? r.get('volume').toNumber()
  : r.get('volume'),      }));
    } finally {
      await session.close();
    }
  }

  async highRiskTransactions() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (a:Entity)-[r:TRANSACTED]->(b:Entity)
        WHERE r.amount > 500000
        RETURN a.id AS from,
               b.id AS to,
               r.amount AS amount,
               r.timestamp AS timestamp
        ORDER BY r.amount DESC
        LIMIT 20
      `);

      return result.records.map(r => ({
        from: r.get('from'),
        to: r.get('to'),
        amount: this.safeNumber(r.get('amount')),
        timestamp: r.get('timestamp'),
      }));
    } finally {
      await session.close();
    }
  }

  async hubs() {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(`
        MATCH (e:Entity)-[r:TRANSACTED]-()
        RETURN e.id AS entity, count(r) AS connections
        ORDER BY connections DESC
        LIMIT 10
      `);

      return result.records.map(r => ({
        entity: r.get('entity'),
        connections: r.get('connections').toNumber(),
      }));
    } finally {
      await session.close();
    }
  }

  async amlScore() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH (e:Entity)-[r:TRANSACTED]-()
      WITH e,
           count(r) AS txs,
           sum(r.amount) AS volume,
           max(r.amount) AS max_tx

      RETURN e.id AS entity,
             txs,
             volume,
             max_tx,
             (txs * 0.3 + volume * 0.7) AS risk_score
      ORDER BY risk_score DESC
      LIMIT 20
    `);

    return result.records.map(r => ({
      entity: r.get('entity'),
      txs: r.get('txs').toNumber?.() ?? r.get('txs'),
      volume: r.get('volume'),
      max_tx: r.get('max_tx'),
      risk_score: r.get('risk_score'),
    }));
  } finally {
    await session.close();
  }
}

async circularFlow() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH p=(a:Entity)-[:TRANSACTED*2..4]->(a)
      RETURN p
      LIMIT 10
    `);

    return result.records.map(r => ({
      path: r.get('p'),
    }));
  } finally {
    await session.close();
  }
}

async layering() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH p=(a:Entity)-[:TRANSACTED*3..6]->(b)
      RETURN p
      LIMIT 10
    `);

    return result.records.map(r => ({
      path: r.get('p'),
    }));
  } finally {
    await session.close();
  }
}

async bigMoney() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH (a:Entity)-[r:TRANSACTED]->(b:Entity)
      WHERE r.amount > 1000000
      RETURN a.id AS from,
             b.id AS to,
             r.amount AS amount,
             r.timestamp AS timestamp
      ORDER BY r.amount DESC
      LIMIT 20
    `);

    return result.records.map(r => ({
      from: r.get('from'),
      to: r.get('to'),
      amount: r.get('amount'),
      timestamp: r.get('timestamp'),
    }));
  } finally {
    await session.close();
  }
}

async whales() {
  const session = this.neo4j.getReadSession();

  try {
    const result = await session.run(`
      MATCH (a:Entity)-[r:TRANSACTED]->()
      RETURN a.id AS entity,
             sum(r.amount) AS total
      ORDER BY total DESC
      LIMIT 10
    `);

    return result.records.map(r => ({
      entity: r.get('entity'),
      total: r.get('total'),
    }));
  } finally {
    await session.close();
  }
}

  private safeNumber(value: any): number {
    return typeof value?.toNumber === 'function'
      ? value.toNumber()
      : Number(value);
  }


}