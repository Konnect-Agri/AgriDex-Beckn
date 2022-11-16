import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ConfirmService } from './confirm.service';

@Controller('confirm')
export class ConfirmController {
  constructor(private readonly confirmService: ConfirmService) { }

  @Post()
  async handleConfirm(@Body() body: any, @Headers('host') host: string) {
    return this.confirmService.handleConfirm(body, host);
  }
}
