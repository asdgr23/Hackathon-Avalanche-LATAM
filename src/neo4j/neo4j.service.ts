import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver;

  async onModuleInit() {
    // Por ahora usamos valores por defecto
    const uri = 'bolt://localhost:7687';
    const user = 'neo4j';
    const password = 'password';
    
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  async onModuleDestroy() {
    await this.driver?.close();
  }

  getSession(): Session {
    return this.driver.session();
  }

  async query(cypher: string, params?: Record<string, any>) {
    const session = this.getSession();
    try {
      const result = await session.run(cypher, params);
      return result.records.map(record => record.toObject());
    } finally {
      await session.close();
    }
  }
}