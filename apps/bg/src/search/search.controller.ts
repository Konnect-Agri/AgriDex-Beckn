import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { response, Response } from 'express';
import { SearchDTO } from './dto/search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post()
  create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() searchDto: SearchDTO,
  ) {
    console.log('BG search controller');
    // TODO: add request validation
    // send acknoledgement to BAP
    res
      .json({
        message: {
          ack: {
            status: 'ACK',
          },
        },
      })
      .status(200);

    // forward the request
    this.searchService.handleSearch(searchDto, req.headers['host']);
  }
}
