import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post()
  async handleSearchRequest(@Body() body: any) {
    return this.searchService.handleSearchRequest(body);
  }
}
