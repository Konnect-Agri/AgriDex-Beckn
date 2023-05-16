import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OnTrackService } from './on-track.service';

@Controller('on_track')
export class OnTrackController {
  constructor(private readonly onTrackService: OnTrackService) { }

  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };
    // sending acknowledgement to BPP
    res.json(ack).status(200);
    return this.onTrackService.handleOnTrack(body);
  }
}
