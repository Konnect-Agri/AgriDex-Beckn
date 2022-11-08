import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OnSelectService } from './on-select.service';

@Controller('on-select')
export class OnSelectController {
  constructor(private readonly onSelectService: OnSelectService) { }

  @Post()
  async handleOnSelect(
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

    this.onSelectService.handleSelectResponse(body);
  }
}
