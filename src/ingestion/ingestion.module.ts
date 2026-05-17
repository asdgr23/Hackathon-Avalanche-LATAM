import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { BankTransformer } from './transformers/bank.transformer';
import { ErpTransformer } from './transformers/erp.transformer';
import { SatTransformer } from './transformers/sat.transformer';
import { ContractTransformer } from './transformers/contract.transformer';
import { EntityResolutionModule } from 'src/entity-resolution/entity-resolution.module';

@Module({
  imports: [
    EntityResolutionModule,
  ],
 controllers: [IngestionController],
  providers: [
    IngestionService,
    BankTransformer,
    ErpTransformer,
    SatTransformer,
    ContractTransformer
  ],
})
export class IngestionModule {}
