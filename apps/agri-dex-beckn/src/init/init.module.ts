import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InitService } from './init.service';

@Module({
  imports: [HttpModule],
  providers: [InitService]
})
export class InitModule { }
