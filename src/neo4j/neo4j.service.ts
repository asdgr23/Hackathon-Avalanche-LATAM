import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver!: Driver;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const uri = this.config.get<string>('NEO4J_URI');
    const user = this.config.get<string>('NEO4J_USERNAME');
    const pass = this.config.get<string>('NEO4J_PASSWORD');

    if (!uri || !user || !pass) {
      throw new Error('Missing Neo4j env variables');
    }

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));
  }

  getWriteSession(): Session {
    return this.driver.session({ defaultAccessMode: neo4j.session.WRITE });
  }

  getReadSession(): Session {
    return this.driver.session({ defaultAccessMode: neo4j.session.READ });
  }

  async onModuleDestroy() {
    await this.driver.close();
  }
}