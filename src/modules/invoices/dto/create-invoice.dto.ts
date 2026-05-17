import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsArray, ValidateNested, Min, IsUUID, } from 'class-validator';
import { Type } from 'class-transformer';

export enum InvoiceStatus {
  PENDING   = 'PENDING',
  PAID      = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE   = 'OVERDUE',
}

export enum InvoiceType {
  INGRESO  = 'I',   // Ingreso
  EGRESO   = 'E',   // Egreso
  TRASLADO = 'T',   // Traslado
  NOMINA   = 'N',   // Nómina
  PAGO     = 'P',   // Pago
}

export class InvoiceConceptDto {
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitPrice?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  subtotal?: number;
}

export class CreateInvoiceDto {
  @IsString()
  folio?: string;           // folio fiscal / UUID del CFDI

  @IsString()
  emisorRfc?: string;       // quien emite

  @IsString()
  receptorRfc?: string;      // quien recibe

  @IsString()
  emisorName?: string;

  @IsString()
  receptorName?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  subtotal?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  tax?: number;         // IVA u otros impuestos

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  total!: number;

  @IsEnum(InvoiceType)
  type?: InvoiceType;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus = InvoiceStatus.PENDING;

  @IsDateString()
  issuedAt?: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceConceptDto)
  @IsOptional()
  concepts?: InvoiceConceptDto[];
}