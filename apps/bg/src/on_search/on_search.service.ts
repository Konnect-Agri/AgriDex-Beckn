import { Injectable } from '@nestjs/common';
import { OnSearchDTO } from './dto/on_search.dto';

@Injectable()
export class OnSearchService {
  handleOnSearch(onSearchDto: OnSearchDTO) {
    return 'This action adds a new onSearch';
  }
}
