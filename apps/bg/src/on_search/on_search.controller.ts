import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OnSearchService } from './on_search.service';

@Controller('on-search')
export class OnSearchController {
  constructor(private readonly onSearchService: OnSearchService) { }

  @Post()
  create(@Req() req: Request, @Res() res: Response, @Body() onSearchDto: any) {
    console.log('BG on-search controller');
    // TODO: add request validation
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };
    // send acknoledgement to BPP
    res.json(ack).status(200);

    // forward the request
    return this.onSearchService.handleOnSearch(onSearchDto);
  }
}
