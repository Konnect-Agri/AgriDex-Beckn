import { Controller, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import { SearchDTO, SearchReq } from './dto/on-search.dto';
import { SearchService } from './on-search.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Ack } from 'utils/types/ack';

@Controller('on_search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @ApiOperation({
    summary: 'Listen to the response of async search request from the BPP',
  })
  @ApiResponse({
    type: Ack,
    status: 200,
    description: 'Acknowledgement to BPP',
  })
  @ApiBody({ type: SearchDTO })
  @HttpCode(200)
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
