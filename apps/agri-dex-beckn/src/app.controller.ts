import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appGateway: AppGateway,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  async handleResponse(
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
    console.log('final response in seach controller in proxy: ', body);
    this.appGateway.handleResponse(body);
  }
}
