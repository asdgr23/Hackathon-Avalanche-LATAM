import { Injectable } from '@nestjs/common';
import { GraphService } from '../graph/graph.service';

@Injectable()
export class TransactionsService {

  constructor(
    private readonly graphService:
    GraphService,
  ) {}

  async create(dto: any) {

    // Crear nodos

    await this.graphService
      .createAccount(dto.fromAccount);

    await this.graphService
      .createAccount(dto.toAccount);

    // Crear relación

    await this.graphService
      .createTransactionRelation(
        dto.fromAccount,
        dto.toAccount,
        dto.amount,
      );

    return {
      success: true,
    };
  }
}