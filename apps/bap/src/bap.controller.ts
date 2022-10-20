import { Controller, Get } from '@nestjs/common';
import { BapService } from './bap.service';

@Controller()
export class BapController {
  constructor(private readonly bapService: BapService) {}

  @Get()
  getHello(): string {
    return this.bapService.getHello();
  }
}
