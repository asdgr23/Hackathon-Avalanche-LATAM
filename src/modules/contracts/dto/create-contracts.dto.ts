import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContractStatus {
  DRAFT     = 'DRAFT',
  ACTIVE    = 'ACTIVE',
  EXPIRED   = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  DISPUTED  = 'DISPUTED',
}

export enum ContractType {
  SERVICE    = 'SERVICE',
  PURCHASE   = 'PURCHASE',
  LEASE      = 'LEASE',
  EMPLOYMENT = 'EMPLOYMENT',
  NDA        = 'NDA',
  LOAN       = 'LOAN',
}

export class CreateContractDto {
  @IsString()
  contractId?: string;    // ID interno o número de contrato

  @IsArray()
  @IsString({ each: true })
  partiesRfc?: string[];    // todos los firmantes (puede ser >2)

  @IsArray()
  @IsString({ each: true })
  partiesName?: string[];

  @IsEnum(ContractType)
  type?: ContractType;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus = ContractStatus.ACTIVE;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  value?: number;       // valor económico del contrato

  @IsDateString()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  jurisdiction?: string;    // 'MX-CMX', 'US-NY', etc.
}