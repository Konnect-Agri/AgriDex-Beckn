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
  constructor(private readonly onSearchService: OnSearchService) { }

  @Post()
  create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() searchDto: SearchDTO,
  ) {
    // TODO: add request validation
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
