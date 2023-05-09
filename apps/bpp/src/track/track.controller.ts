import { Body, Controller, Post } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async handleTrack(@Body() body: any) {
    return this.trackService.handleTrackRequest(body);
  }
}
