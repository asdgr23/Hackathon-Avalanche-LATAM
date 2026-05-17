import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  fromAccount!: string;

  @IsString()
  toAccount!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;
}