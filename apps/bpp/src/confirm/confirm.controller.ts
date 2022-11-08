import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmService } from './confirm.service';

@Controller('confirm')
export class ConfirmController {
  constructor(private readonly confirmService: ConfirmService) { }

  @Post()
  async handleInitialRequest(@Body() body: any) {
    return this.confirmService.handleConfirm(body);
  }
}
