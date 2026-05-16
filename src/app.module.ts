import { Module } from '@nestjs/common';
import { AmlModule } from './aml/aml.module';
import { SmurfingService } from './features/smurfing/smurfing.service';
import { StructuringService } from './features/structuring/structuring.service';
import { VelocityService } from './features/velocity/velocity.service';
import { ConcentrationService } from './features/concentration/concentration.service';
import { GraphCyclesService } from './features/graph-cycles/graph-cycles.service';
import { ScoringService } from './features/scoring/scoring.service';
import { WatchlistsService } from './features/watchlists/watchlists.service';

@Module({
  imports: [AmlModule],
  controllers: [],
  providers: [SmurfingService, StructuringService, VelocityService, ConcentrationService, GraphCyclesService, ScoringService, WatchlistsService],
})
export class AppModule {}
