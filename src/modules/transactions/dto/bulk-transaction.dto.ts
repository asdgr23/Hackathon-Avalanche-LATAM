import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTransactionDto } from './create-transaction.dto';

export class BulkTransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  transactions!: CreateTransactionDto[];
}