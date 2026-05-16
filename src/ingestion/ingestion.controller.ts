import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) {}

  @Post('bank')
  ingestBank(@Body() payload: any[]) {
    return this.ingestionService.ingest('BANK', payload);
  }

  @Post('erp')
  ingestErp(@Body() payload: any[]) {
    return this.ingestionService.ingest('ERP', payload);
  }

  @Post('sat')
  ingestSat(@Body() payload: any[]) {
    return this.ingestionService.ingest('SAT', payload);
  }

  @Post('contracts')
  ingestContracts(@Body() payload: any[]) {
    return this.ingestionService.ingest('CONTRACT', payload);
  }
}

