// modules/invoices/invoices.controller.ts
import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { QueryInvoiceDto } from './dto/query-invoice.dto';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class BulkInvoiceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceDto)
  invoices!: CreateInvoiceDto[];
}

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // POST /invoices — registra una factura y crea el edge en Neo4j
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  // POST /invoices/bulk — carga masiva (CFDI batch)
  @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  bulk(@Body() dto: BulkInvoiceDto) {
    return this.invoicesService.createBulk(dto.invoices);
  }

  // GET /invoices?emisorRfc=XXX&status=PAID
  @Get()
  findByRfc(@Query() query: QueryInvoiceDto) {
    return this.invoicesService.findByRfc(query);
  }

  // GET /invoices/triangulation — detecta esquemas de facturación circular
  @Get('triangulation')
  triangulation() {
    return this.invoicesService.detectTriangulation();
  }
}