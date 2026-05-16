import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AmlRequestDto } from './dto/amlrequest.dto';
import { AmlService } from './aml.service';

@Controller('aml')
export class AmlController {
     constructor(private readonly amlService: AmlService) {}

  @Post('analyze')
  analyze(@Body() dto: AmlRequestDto) {
    return this.amlService.analyze(dto);
  }

}
