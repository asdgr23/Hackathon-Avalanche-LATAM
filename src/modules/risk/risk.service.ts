import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskService {
  constructor(private readonly neo4j: Neo4jService) {}

  // detecta clusters sospechosos con Cypher graph algorithms
  async detectHighRiskClusters(): Promise<RiskCluster[]> {
    const result = await this.neo4j.read(
      `MATCH (a)-[r:CONNECTED]->(b)
       WHERE r.weight > 0.8
       WITH a, collect(b) AS partners, sum(r.weight) AS totalWeight
       WHERE size(partners) > 3
       RETURN a.id AS entityId, partners, totalWeight
       ORDER BY totalWeight DESC
       LIMIT 50`,
    );
    return result.records.map(r => ({
      entityId: r.get('entityId'),
      connections: r.get('partners').length,
      riskScore: r.get('totalWeight'),
    }));
  }
}
