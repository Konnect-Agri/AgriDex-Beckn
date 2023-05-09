import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OnInitService } from './on-init.service';

@Controller('on_init')
export class OnInitController {
  constructor(private readonly onInitService: OnInitService) {}

  @Post()
  async handleOnInit(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };

    // sending acknowledgement to BPP
    res.json(ack).status(200);

    return this.onInitService.handleOnInitResponse(body);
  }
}
