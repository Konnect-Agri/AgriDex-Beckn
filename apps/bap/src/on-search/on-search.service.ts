import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from '../../../../utils/utils';
import { SearchDTO } from './dto/on-search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) { }

  async handleSearch(searchResponse: SearchDTO) {
    // this is the REST endpoint where the BAP callback will provide the result
    console.log('in BAP handle search rest fn: ');

    try {
      // TODO: response content verification before responding with ACK and forwarding

      // forwarding request to proxy
      // this.socketClient.emit('searchResponse', searchResponse);

      // send the response to Proxy

      requestForwarder(process.env.PROXY_URL, searchResponse, this.httpService);
    } catch (err) {
      console.error('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
