import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OnInitController } from './on-init.controller';
import { OnInitService } from './on-init.service';

@Module({
  imports: [HttpModule],
  controllers: [OnInitController],
  providers: [OnInitService]
})
export class OnInitModule { }
