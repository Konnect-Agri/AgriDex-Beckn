import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO, SearchReq } from './dto/on-search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) { }
  async handleSearch(searchReq: SearchDTO) {
    try {
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const requestBody = {
        context: searchReq.context,
        message: {
          intent: {
            tags: {
              block:
                searchReq.message.catalogue.providers[0].locations[0].descriptor
                  .name,
              district:
                searchReq.message.catalogue.providers[0].locations[1].descriptor
                  .name,
              bank_name: searchReq.message.catalogue.providers[0].id,
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
