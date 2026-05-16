// modules/transactions/transactions.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BulkTransactionDto } from './dto/bulk-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // POST /transactions — ingresa una sola transacción
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  // POST /transactions/bulk — ingresa N transacciones y dispara el graph builder
  @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  bulk(@Body() dto: BulkTransactionDto) {
    return this.transactionsService.createBulkAndTriggerGraph(dto.transactions);
  }
}