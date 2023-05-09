import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { OnSearchDTO } from './dto/search.dto';
import { SearchDTO } from './dto/on-search.dto';
import { OnSearchService } from './search.service';
import { Request, Response } from 'express';

@Controller('search')
export class OnSearchController {
  constructor(private readonly onSearchService: OnSearchService) {}

  @Post()
  create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() searchDto: SearchDTO,
  ) {
    console.log('request was received here!!');
    // TODO: add request validation (this TODO might not be required since the requests are already routed through the protocol server which validates them before sending in)
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };
    res.json(ack).status(200);
    this.onSearchService.handleOnSearch(searchDto);
  }
}
