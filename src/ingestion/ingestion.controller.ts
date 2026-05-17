import { BadRequestException, Body, Controller, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { GraphService } from 'src/modules/graph/graph.service';

@Controller('ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService, private readonly graphService: GraphService) {    }

@Post('bulk')
ingestBulk(@Body() dto: any) {
  return this.ingestionService.ingestFromDto(dto);
}

 @Post('upload/:source')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('source') source: string,
    @UploadedFile() file: any,
  ) {
    const json = JSON.parse(file.buffer.toString());
const normalized = source.toUpperCase() as 'BANK' | 'ERP' | 'SAT' | 'CONTRACT';
    return this.ingestionService.ingest(
      normalized as 'BANK' | 'ERP' | 'SAT' | 'CONTRACT',
      json,
    );
  }

@Post('pipeline-file')
@UseInterceptors(FileInterceptor('file'))
runPipelineFile(@UploadedFile() file: any) {

  const events = JSON.parse(file.buffer.toString());

  return this.graphService.build(events);
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

