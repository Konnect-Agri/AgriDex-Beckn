import { Module } from '@nestjs/common';
import { OnSelectService } from './on-select.service';
import { OnSelectController } from './on-select.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OnSelectService],
  controllers: [OnSelectController],
})
export class OnSelectModule { }
