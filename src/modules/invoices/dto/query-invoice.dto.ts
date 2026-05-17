import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { InvoiceStatus, InvoiceType } from './create-invoice.dto';

export class QueryInvoiceDto {
  @IsString()
  @IsOptional()
  emisorRfc?: string;

  @IsString()
  @IsOptional()
  receptorRfc?: string;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsEnum(InvoiceType)
  @IsOptional()
  type?: InvoiceType;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}