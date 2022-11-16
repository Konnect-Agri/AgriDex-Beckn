import { Module } from '@nestjs/common';
import { SelectService } from './select.service';
import { SelectController } from './select.controller';

@Module({
  providers: [SelectService],
  controllers: [SelectController]
})
export class SelectModule {}
