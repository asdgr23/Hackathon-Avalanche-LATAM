import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { RelationsService } from './relations.service';

@Controller('relations')
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  @Post('build')
  @HttpCode(HttpStatus.CREATED)
  build(@Body() dto: any) {
    return this.relationsService.createEdge(dto);
  }

  @Get('between')
  findPath(@Query() query: any) {
    return this.relationsService.findPath(query);
  }

  @Get('implicit')
  detectImplicit() {
    return this.relationsService.detectImplicitConnections();
  }
}