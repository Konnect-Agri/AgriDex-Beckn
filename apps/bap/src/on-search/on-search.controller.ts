import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SearchDTO, SearchReq } from './dto/on-search.dto';
import { SearchService } from './on-search.service';

@Controller('on-search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post()
  create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() searchDto: SearchDTO,
  ) {
    // TODO: validate request
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };
    // sending acknowledgement to BPP
    res.json(ack).status(200);
    // console.log('searchReq: ', searchDto);
    return this.searchService.handleSearch(searchDto);
  }
}
