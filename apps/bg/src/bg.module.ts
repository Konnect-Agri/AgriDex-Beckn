import { Module } from '@nestjs/common';
import { BgController } from './bg.controller';
import { BgService } from './bg.service';

@Module({
  imports: [],
  controllers: [BgController],
  providers: [BgService],
})
export class BgModule {}
