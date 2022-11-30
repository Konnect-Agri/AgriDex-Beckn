import { Body, Controller, Post } from '@nestjs/common';
import { SelectService } from './select.service';

@Controller('select')
export class SelectController {
  constructor(private readonly selectService: SelectService) { }
  @Post()
  async handleSelectRequest(@Body() body: any) {
    return this.selectService.handleSelectRequest(body);
  }
}
