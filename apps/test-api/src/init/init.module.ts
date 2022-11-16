import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { InitController } from './init.controller';

@Module({
  providers: [InitService],
  controllers: [InitController]
})
export class InitModule {}
