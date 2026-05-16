import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum TransactionType {
  PAYMENT    = 'PAYMENT',
  INVOICE    = 'INVOICE',
  CONTRACT   = 'CONTRACT',
  TRANSFER   = 'TRANSFER',
}

export class CreateTransactionDto {
  @IsString()
  sourceRfc?: string;           // RFC del emisor

  @IsString()
  targetRfc?: string;           // RFC del receptor

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount?: number;

  @IsDateString()
  date?: string;

  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsString()
  @IsOptional()
  concept?: string;

  @IsString()
  @IsOptional()
  externalId?: string; 

}