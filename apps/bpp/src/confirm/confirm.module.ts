import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfirmController } from './confirm.controller';
import { ConfirmService } from './confirm.service';

@Module({
  imports: [HttpModule],
  controllers: [ConfirmController],
  providers: [ConfirmService]
})
export class ConfirmModule { }
