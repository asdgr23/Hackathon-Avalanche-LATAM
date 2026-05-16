import { Module } from '@nestjs/common';
import { AmlModule } from './aml/aml.module';
import { SmurfingService } from './features/smurfing/smurfing.service';
import { StructuringService } from './features/structuring/structuring.service';
import { VelocityService } from './features/velocity/velocity.service';
import { ConcentrationService } from './features/concentration/concentration.service';
import { GraphCyclesService } from './features/graph-cycles/graph-cycles.service';
import { ScoringService } from './features/scoring/scoring.service';
import { WatchlistsService } from './features/watchlists/watchlists.service';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { EntitiesModule } from './modules/entities/entities.module';
import { RelationsModule } from './modules/relations/relations.module';
import { GraphModule } from './modules/graph/graph.module';
import { RiskModule } from './modules/risk/risk.module';
import { Neo4jModule } from 'nest-neo4j';

@Module({
  imports: [AmlModule, TransactionsModule, EntitiesModule, RelationsModule, GraphModule, RiskModule],
  controllers: [],
  providers: [SmurfingService, StructuringService, VelocityService, ConcentrationService, GraphCyclesService, ScoringService, WatchlistsService],
})
export class AppModule {}

/*
@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: process.env.NEO4J_HOST,
      port: 7687,
      username: process.env.NEO4J_USER,
      password: process.env.NEO4J_PASSWORD,
    }),
    // módulos existentes
    GraphModule,
    EntitiesModule,
    RelationsModule,
    RiskModule,
  ],
})
export class AppModule {}*/