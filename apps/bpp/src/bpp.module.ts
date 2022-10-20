import { Module } from '@nestjs/common';
import { BppController } from './bpp.controller';
import { BppService } from './bpp.service';

@Module({
  imports: [],
  controllers: [BppController],
  providers: [BppService],
})
export class BppModule {}
