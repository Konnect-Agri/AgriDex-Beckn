import { Body, Controller, Post } from '@nestjs/common';
import { OnUpdateService } from './on-update.service';

@Controller('on-update')
export class OnUpdateController {
  constructor(private readonly onUpdateService: OnUpdateService) { }

  @Post()
  async handleOnUpdate(@Body() body: any) {
    return this.onUpdateService.handleOnUpdate(body);
  }
}
