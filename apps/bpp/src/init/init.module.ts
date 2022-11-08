import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
  imports: [HttpModule],
  controllers: [InitController],
  providers: [InitService],
})
export class InitModule { }
