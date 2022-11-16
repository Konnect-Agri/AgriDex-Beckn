import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [HttpModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule { }
