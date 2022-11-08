import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) { }

  async handleSearch(searchDto: SearchDTO, host: string) {
    // TODO: add some kind of registry which stores the BAP ids and BPP URLs
    console.log('in BG');
    try {
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // ADD BAP ID and URL in context
      searchDto.context.bap_id = '101';
      searchDto.context.bap_uri = `http://${host}`;
      //TODO: verify the contents of request before deciding on ACK or NACK

      // this.httpService.post(searchDto.context.bap_uri, ack, requestOptions);
      // forward the request to BPP for discovery
      await lastValueFrom(
        this.httpService.post(
          process.env.BPP_SEARCH_URL,
          searchDto,
          requestOptions,
        ),
      );
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
