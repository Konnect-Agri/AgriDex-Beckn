import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UpdateModule } from '../update/update.module';
import { UpdateService } from '../update/update.service';
import { ConfirmController } from './confirm.controller';
import { ConfirmService } from './confirm.service';

@Module({
  imports: [UpdateModule, HttpModule],
  controllers: [ConfirmController],
  providers: [ConfirmService, UpdateService],
})
export class ConfirmModule { }
