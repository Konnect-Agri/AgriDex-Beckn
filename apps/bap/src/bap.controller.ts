import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { BapService } from './bap.service';

@Controller()
export class BapController {
  constructor(private readonly bapService: BapService) { }

  @Get()
  getHello(): string {
    return this.bapService.getHello();
  }

  @Post()
  async handleInitialRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    res
      .json({
        message: {
          ack: 'ACK',
        },
      })
      .status(200);

    return this.bapService.handleInitialRequest(body);
  }
}
