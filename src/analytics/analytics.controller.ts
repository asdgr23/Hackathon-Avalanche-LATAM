import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('top-entities')
  topEntities() {
    return this.analytics.topEntities();
  }

  @Get('top-volume')
  topVolume() {
    return this.analytics.topVolume();
  }

  @Get('high-risk')
  highRisk() {
    return this.analytics.highRiskTransactions();
  }

  @Get('hubs')
  hubs() {
    return this.analytics.hubs();
  }

  @Get('aml-score')
amlScore() {
  return this.analytics.amlScore();
}

@Get('circular')
circular() {
  return this.analytics.circularFlow();
}

@Get('layering')
layering() {
  return this.analytics.layering();
}

@Get('big-money')
bigMoney() {
  return this.analytics.bigMoney();
}

@Get('whales')
whales() {
  return this.analytics.whales();
}
}
