import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) { }
  async handleSearch(searchDto: SearchDTO) {
    console.log('in BG');
    try {
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
        body: searchDto,
        redirect: 'follow',
      };
      //TODO: verify the contents of request before deciding on ACK or NACK
      const ack = {
        message: {
          ack: {
            status: 'ACK',
          },
        },
      };
      // this.httpService.post(searchDto.context.bap_uri, ack, requestOptions);
      // forward the request to BPP for discovery
      await lastValueFrom(
        this.httpService.post(
          process.env.BPP_SEARCH_URL,
          searchDto,
          requestOptions,
        ),
      );

      // sending acknowlegement response to BAP
      return ack;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
