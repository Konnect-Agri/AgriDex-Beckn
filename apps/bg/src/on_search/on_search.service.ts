import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'apps/bap/src/utils';
import { OnSearchDTO } from './dto/on_search.dto';

@Injectable()
export class OnSearchService {
  constructor(private readonly httpService: HttpService) { }

  handleOnSearch(onSearchDto: any, host: string) {
    try {
      // adding bpp url to context
      onSearchDto.context.bpp_id = '301';
      onSearchDto.context.bpp_uri = `http://${host}`;
      // forwarding the request back to BAP
      console.log('onSearchDto.context.bap_uri: ', onSearchDto.context.bap_uri);
      requestForwarder(
        onSearchDto.context.bap_uri + '/on-search',
        onSearchDto,
        this.httpService,
      );
    } catch (err) {
      console.log('err in on-search: ', err);
      throw new InternalServerErrorException();
    }
  }
}
