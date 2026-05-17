// modules/transactions/transactions.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BulkTransactionDto } from './dto/bulk-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTransactionDto) { 
    return await this.transactionsService.create(dto);
  }

   @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  bulk(@Body() dto: BulkTransactionDto) {
    return this.transactionsService.createBulkAndTriggerGraph(dto.transactions);
  }
}