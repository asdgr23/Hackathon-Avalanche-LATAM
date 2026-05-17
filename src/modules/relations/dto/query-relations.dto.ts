import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryRelationsDto {
  @IsString()
  entityAId?: string;

  @IsString()
  entityBId?: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  @Type(() => Number)
  @IsOptional()
  maxHops?: number = 2;   // profundidad de búsqueda en el grafo
}