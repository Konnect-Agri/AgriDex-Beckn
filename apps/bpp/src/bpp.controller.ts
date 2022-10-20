import { Controller, Get } from '@nestjs/common';
import { BppService } from './bpp.service';

@Controller()
export class BppController {
  constructor(private readonly bppService: BppService) {}

  @Get()
  getHello(): string {
    return this.bppService.getHello();
  }
}
