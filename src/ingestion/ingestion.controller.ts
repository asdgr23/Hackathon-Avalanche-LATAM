import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) {    }

 @Post('upload/:source')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('source') source: string,
    @UploadedFile() file: any,
  ) {
    const json = JSON.parse(file.buffer.toString());
  const normalized = source.toUpperCase();

    return this.ingestionService.ingest(
      normalized as 'BANK' | 'ERP' | 'SAT' | 'CONTRACT',
      json,
    );
  }

@Post(':source')
ingest(
  @Param('source') source: string,
  @Body() payload: Record<string, any>[],
) {
  const normalized = source.toUpperCase();

  return this.ingestionService.ingest(
    normalized as 'BANK' | 'ERP' | 'SAT' | 'CONTRACT',
    payload,
  );
}
}

