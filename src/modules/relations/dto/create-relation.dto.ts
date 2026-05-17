import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum RelationType {
  TRANSACTED_WITH = 'TRANSACTED_WITH',
  INVOICED        = 'INVOICED',
  SIGNED          = 'SIGNED',
  SHARES_ADDRESS  = 'SHARES_ADDRESS',
  SHARES_DIRECTOR = 'SHARES_DIRECTOR',
}

export class CreateRelationDto {
  @IsString()
  fromId?: string;

  @IsString()
  toId?: string;

  @IsEnum(RelationType)
  type?: RelationType;

  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  @IsOptional()
  weight?: number; // 0.0 → 1.0, calculado por el service si no se pasa

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;
}