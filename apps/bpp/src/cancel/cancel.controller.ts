/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { CancelService } from './cancel.service';

@Controller('cancel')
export class CancelController {
  constructor(private readonly cancelService: CancelService) {}

  @Post()
  async cancelTrack(@Body() body: any) {
    return this.cancelService.cancelRequest(body);
  }
}
