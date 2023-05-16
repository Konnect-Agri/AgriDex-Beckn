import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OnConfirmService } from './on-confirm.service';

@Controller('on_confirm')
export class OnConfirmController {
  constructor(private readonly onConfirmService: OnConfirmService) { }

  @Post()
  async handleOnConfirm(
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

    res.json(ack).status(200);

    this.onConfirmService.handleConfirmResponse(body);
  }
}
