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
      console.log('onsearch context: ', onSearchDto.context);
      onSearchDto.context.bpp_id = process.env.BPP_ID;
      onSearchDto.context.bpp_uri = process.env.BPP_URL;
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
