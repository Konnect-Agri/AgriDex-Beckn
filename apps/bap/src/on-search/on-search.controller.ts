import { Controller, Post, Body } from '@nestjs/common';
import { SearchDTO, SearchReq } from './dto/search.dto';
import { SearchService } from './on-search.service';

@Controller('on-search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post()
  create(@Body() searchDto: SearchReq) {
    // console.log('searchReq: ', searchDto);
    return this.searchService.handleSearch(searchDto);
  }
}
