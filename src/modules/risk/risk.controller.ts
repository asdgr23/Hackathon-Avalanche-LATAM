import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskScoreDto } from './dto/risk-score.dto';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  // GET /risk/clusters — detecta todos los clusters de alto riesgo
  @Get('clusters')
  clusters() {
    return this.riskService.detectHighRiskClusters();
  }

  // POST /risk/score/:id — calcula score de riesgo de una entidad específica
  @Post('score/:id')
  @HttpCode(HttpStatus.OK)
  score(@Param('id') id: string, @Body() dto: RiskScoreDto) {
    return this.riskService.scoreEntity({ ...dto, entityId: id });
  }

  // GET /risk/anomalies — conexiones implícitas sospechosas
  @Get('anomalies')
  anomalies() {
    return this.riskService.detectAnomalies();
  }
}