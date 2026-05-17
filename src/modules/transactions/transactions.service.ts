import { Injectable } from '@nestjs/common';
import { GraphService } from '../graph/graph.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

interface RawTransaction {
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: Date;
  rfc: string;
}

@Injectable()
export class TransactionsService {

  constructor(
    private readonly graphService:
    GraphService,
  ) {}

  // transactions.service.ts
async create(dto: CreateTransactionDto) {
  const rawTransaction: RawTransaction = {
    fromAccount: dto.fromAccount,
    toAccount: dto.toAccount,
    amount: dto.amount,
    date: new Date(),
    rfc: dto.fromAccount, // necesitas definir qué es RFC
  };

  
  await this.graphService.buildFromTransactions([rawTransaction]);

  return {
    success: true,
  };
}
}