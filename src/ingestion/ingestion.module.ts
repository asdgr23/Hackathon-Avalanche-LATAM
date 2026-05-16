import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { BankTransformer } from './transformers/bank.transformer';
import { ErpTransformer } from './transformers/erp.transformer';
import { SatTransformer } from './transformers/sat.transformer';
import { ContractTransformer } from './transformers/contract.transformer';

@Module({
 controllers: [IngestionController],
  providers: [
    IngestionService,
    BankTransformer,
    ErpTransformer,
    SatTransformer,
    ContractTransformer,
  ],
})
export class IngestionModule {}
