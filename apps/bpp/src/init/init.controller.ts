import { Body, Controller, Post } from '@nestjs/common';
import { InitService } from './init.service';

@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) { }

  @Post()
  async handleInit(@Body() body: any) {
    return this.initService.handleInit(body);
  }
}
