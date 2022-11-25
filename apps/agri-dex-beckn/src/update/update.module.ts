import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';

@Module({
  imports: [HttpModule],
  providers: [UpdateService],
})
export class UpdateModule { }
