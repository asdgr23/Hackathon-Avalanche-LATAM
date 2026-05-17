import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ContractStatus, ContractType } from './create-contracts.dto';

export class QueryContractDto {
  @IsString()
  @IsOptional()
  rfcParty?: string;    // busca contratos donde participe este RFC

  @IsEnum(ContractType)
  @IsOptional()
  type?: ContractType;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;
}