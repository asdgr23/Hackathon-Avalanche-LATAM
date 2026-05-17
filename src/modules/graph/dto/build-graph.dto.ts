import { IsArray, ValidateNested, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';

export class BuildGraphDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  transactions?: CreateTransactionDto[];

  @IsArray()
  @IsOptional()
  invoices?: any[];

  @IsArray()
  @IsOptional()
  contracts?: any[];
}