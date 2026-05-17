import { Module } from '@nestjs/common';
import { AmlModule } from './aml/aml.module';
<<<<<<< HEAD
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
  imports: [AmlModule, TransactionsModule, EntitiesModule, RelationsModule, GraphModule, RiskModule, InvoicesModule, ContractsModule],
=======

import { IngestionModule } from './ingestion/ingestion.module';
import { SmurfingService } from './aml/features/smurfing/smurfing.service';
import { StructuringService } from './aml/features/structuring/structuring.service';
import { VelocityService } from './aml/features/velocity/velocity.service';
import { ConcentrationService } from './aml/features/concentration/concentration.service';
import { GraphCyclesService } from './aml/features/graph-cycles/graph-cycles.service';
import { ScoringService } from './aml/features/scoring/scoring.service';
import { WatchlistsService } from './aml/features/watchlists/watchlists.service';
import { EntityResolutionService } from './entity-resolution/entity-resolution.service';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ContractsModule } from './modules/contracts/contracts.module';


@Module({
  imports: [AmlModule, IngestionModule],
>>>>>>> daab52c1497042c85336de85bf91a7af9e86c786
  controllers: [],
  providers: [SmurfingService, StructuringService, VelocityService, ConcentrationService, GraphCyclesService, ScoringService, WatchlistsService],
})
export class AppModule {}


import { Module } from '@nestjs/common';
import { Neo4jModule } from './neo4j/neo4j.module';
import { EntitiesModule } from './entities/entities.module';

@Module({
  imports: [
    Neo4jModule,  // Añade esta línea
    EntitiesModule,
  ],
})
export class AppModule {}