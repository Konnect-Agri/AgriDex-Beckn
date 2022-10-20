import { Controller, Get } from '@nestjs/common';
import { BgService } from './bg.service';

@Controller()
export class BgController {
  constructor(private readonly bgService: BgService) {}

  @Get()
  getHello(): string {
    return this.bgService.getHello();
  }
}
