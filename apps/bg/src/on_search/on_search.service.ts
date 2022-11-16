import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class OnSearchService {
  constructor(private readonly httpService: HttpService) { }

  handleOnSearch(onSearchDto: any) {
    try {
      // adding bpp url to context
      console.log('onsearch context: ', onSearchDto.context);
      onSearchDto.context.bpp_id = process.env.BPP_ID;
      onSearchDto.context.bpp_uri = process.env.BPP_URI;
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
