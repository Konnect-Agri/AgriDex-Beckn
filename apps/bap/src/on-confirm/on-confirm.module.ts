import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OnConfirmController } from './on-confirm.controller';
import { OnConfirmService } from './on-confirm.service';

@Module({
  imports: [HttpModule],
  controllers: [OnConfirmController],
  providers: [OnConfirmService]
})
export class OnConfirmModule { }
