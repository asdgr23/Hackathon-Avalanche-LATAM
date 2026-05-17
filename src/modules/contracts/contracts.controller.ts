import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contracts.dto';
import { QueryContractDto } from './dto/query-contracts.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  // POST /contracts — registra un contrato y todos sus edges en Neo4j
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  // GET /contracts?rfcParty=ABC123&type=SERVICE&status=ACTIVE
  @Get()
  findByParty(@Query() query: QueryContractDto) {
    return this.contractsService.findByParty(query);
  }

  // GET /contracts/shared-activity — entidades ligadas por contrato + factura
  @Get('shared-activity')
  sharedActivity() {
    return this.contractsService.detectSharedActivity();
  }
}