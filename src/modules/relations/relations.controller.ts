import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { RelationsService } from './relations.service';
import { CreateRelationDto } from './dto/create-relation.dto';
import { QueryRelationsDto } from './dto/query-relations.dto';

@Controller('relations')
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  // POST /relations/build — crea un edge en el grafo manualmente
  @Post('build')
  @HttpCode(HttpStatus.CREATED)
  build(@Body() dto: CreateRelationDto) {
    return this.relationsService.createEdge(dto);
  }

  // GET /relations/between?entityAId=X&entityBId=Y&maxHops=2
  // detecta si dos entidades están conectadas y por qué camino
  @Get('between')
  findPath(@Query() query: QueryRelationsDto) {
    return this.relationsService.findPath(query);
  }

  // GET /relations/implicit — detecta conexiones implícitas no registradas
  @Get('implicit')
  detectImplicit() {
    return this.relationsService.detectImplicitConnections();
  }
}