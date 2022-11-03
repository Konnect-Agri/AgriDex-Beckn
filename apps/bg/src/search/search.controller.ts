import { Controller, Post, Body } from '@nestjs/common';
import { SearchDTO } from './dto/search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post()
  create(@Body() searchDto: SearchDTO) {
    console.log('BG controller');
    return this.searchService.handleSearch(searchDto);
  }
}
