import { Body, Controller, Post } from '@nestjs/common';
import { UpdateService } from './update.service';

@Controller('update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) { }

  @Post()
  handleUpdate(@Body() body: any) {
    return this.updateService.handleUpdate(body);
  }
}
