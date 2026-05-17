import { IngestionModule } from './ingestion/ingestion.module';
import { SmurfingService } from './aml/features/smurfing/smurfing.service';
import { StructuringService } from './aml/features/structuring/structuring.service';
import { VelocityService } from './aml/features/velocity/velocity.service';
import { ConcentrationService } from './aml/features/concentration/concentration.service';
import { GraphCyclesService } from './aml/features/graph-cycles/graph-cycles.service';
import { ScoringService } from './aml/features/scoring/scoring.service';
import { WatchlistsService } from './aml/features/watchlists/watchlists.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Module } from '@nestjs/common';
import { AmlModule } from './aml/aml.module';

@Module({
  imports: [AmlModule, IngestionModule, Neo4jModule],
  controllers: [],
  providers: [SmurfingService, StructuringService, VelocityService, ConcentrationService, GraphCyclesService, ScoringService, WatchlistsService],
})
export class AppModule {}