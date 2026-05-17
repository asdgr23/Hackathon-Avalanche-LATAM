// modules/entities/entities.controller.ts
import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { ResolveEntityDto } from './dto/resolve-entity.dto';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post('resolve')
  @HttpCode(HttpStatus.OK)
  resolve(@Body() dto: ResolveEntityDto) {
    return this.entitiesService.resolveSingle(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entitiesService.findById(id);
  }

  @Get(':id/neighbors')
  neighbors(@Param('id') id: string) {
    return this.entitiesService.getNeighbors(id);
  }
}