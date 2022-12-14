import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SelectService } from './select.service';

@Module({
  imports: [HttpModule],
  providers: [SelectService],
})
export class SelectModule { }
