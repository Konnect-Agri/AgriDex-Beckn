import { Module } from '@nestjs/common';
import { TrackService } from './cancel.service';
import { TrackController } from './cancel.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TrackService],
  controllers: [TrackController],
})
export class TrackModule { }
