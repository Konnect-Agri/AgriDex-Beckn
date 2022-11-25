import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) { }

  @Get()
  getAllTrackings() {
    return this.trackService.getAllTrackings();
  }

  @Get(':order_id')
  getApplicationForm(@Param('order_id') orderId: string) {
    return this.trackService.handleTrackingInfo(orderId);
  }
}
