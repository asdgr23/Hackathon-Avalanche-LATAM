import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { GraphService } from './graph.service';
import { BuildGraphDto } from './dto/build-graph.dto';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  // POST /graph/build — pipeline completo: datos crudos → Neo4j
  @Post('build')
  @HttpCode(HttpStatus.ACCEPTED)
  build(@Body() dto: BuildGraphDto) {
    return this.graphService.buildFromTransactions(dto.transactions);
  }

  // GET /graph/query?cypher=MATCH(n)RETURN n LIMIT 10
  // solo para debugging interno, protege con guard en prod
  @Get('query')
  query(@Query('cypher') cypher: string) {
    return this.graphService.rawQuery(cypher);
  }

  // GET /graph/stats — métricas del grafo actual
  @Get('stats')
  stats() {
    return this.graphService.getStats();
  }
}