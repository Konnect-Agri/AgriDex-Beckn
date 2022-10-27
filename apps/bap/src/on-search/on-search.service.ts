import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO, SearchReq } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) { }
  async handleSearch(searchReq: SearchReq) {
    try {
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const requestBody = {
        context: {
          domain: {},
          country: {},
          city: {},
          action: 'SEARCH',
          core_version: '1.0',
          bap_id: '101',
          bap_uri: 'http://localhost:3000',
          transaction_id: '101',
          message_id: '201',
          timestamp: Date.now(),
        },
        message: {
          intent: {
            tags: {
              block: searchReq.message.block,
              district: searchReq.message.district,
              bank_name: searchReq.message.bank_name,
            },
          },
        },
      };

      const responseData = await lastValueFrom(
        this.httpService
          .post('http://localhost:3001/search', requestBody, requestOptions)
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );

      return responseData;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
