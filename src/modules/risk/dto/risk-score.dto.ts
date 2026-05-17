import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RiskScoreDto {
  @IsString()
  entityId?: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  @IsOptional()
  threshold?: number = 0.7;    // score mínimo

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  minConnections?: number = 3; // mínimo de conexiones para considerar cluster
}