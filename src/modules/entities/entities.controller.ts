// modules/entities/entities.controller.ts
import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { ResolveEntityDto } from './dto/resolve-entity.dto';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  // POST /entities/resolve — resuelve y deduplica una entidad
  @Post('resolve')
  @HttpCode(HttpStatus.OK)
  resolve(@Body() dto: ResolveEntityDto) {
    return this.entitiesService.resolveSingle(dto);
  }

  // GET /entities/:id — trae una entidad resuelta y sus conexiones
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entitiesService.findById(id);
  }

  // GET /entities/:id/neighbors — entidades conectadas en el grafo
  @Get(':id/neighbors')
  neighbors(@Param('id') id: string) {
    return this.entitiesService.getNeighbors(id);
  }
}