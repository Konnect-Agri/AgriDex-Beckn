import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SearchGateway } from './search.gateway';

@Controller('search')
export class SearchController {
  constructor(private readonly searchGateway: SearchGateway) { }

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
    this.searchGateway.handleResponse(body);
  }
}
