import { Body, Controller, Post } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Post('build')
  buildGraph(@Body() events: any[]) {
    return this.graphService.build(events);
  }
}