import { Module } from '@nestjs/common';
import { OnTrackService } from './on-track.service';
import { OnTrackController } from './on-track.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OnTrackService],
  controllers: [OnTrackController],
})
export class OnTrackModule { }
