import { Module } from '@nestjs/common';
import { BapController } from './bap.controller';
import { BapService } from './bap.service';

@Module({
  imports: [],
  controllers: [BapController],
  providers: [BapService],
})
export class BapModule {}
