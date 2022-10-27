import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OnSearchDTO } from './dto/search.dto';
import { SearchDTO } from './dto/on-search.dto';
import { OnSearchService } from './search.service';

@Controller('on-search')
export class OnSearchController {
  constructor(private readonly onSearchService: OnSearchService) { }

  @Post()
  create(@Body() searchDto: SearchDTO) {
    return this.onSearchService.handleOnSearch(searchDto);
  }
}
