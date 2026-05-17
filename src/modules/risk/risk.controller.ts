import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('clusters')
  clusters() {
    return this.riskService.detectHighRiskClusters();
  }

  @Post('score/:id')
  @HttpCode(HttpStatus.OK)
  score(@Param('id') id: string, @Body() dto: any) {
    return this.riskService.scoreEntity({
      entityId: id,
      ...dto,
    });
  }

  @Get('anomalies')
  anomalies() {
    return this.riskService.detectAnomalies();
  }
}