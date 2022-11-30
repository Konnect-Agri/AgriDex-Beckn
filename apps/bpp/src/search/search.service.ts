import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO } from './dto/on-search.dto';

@Injectable()
export class OnSearchService {
  constructor(private readonly httpService: HttpService) { }

  async handleOnSearch(searchDTO: SearchDTO) {
    console.log('in BPP');
    try {
      console.log('in bpp');

      // forwarding request to providers
      const responseCatalogue = await lastValueFrom(
        this.httpService
          .post(process.env.TEST_API_URI + '/search', searchDTO, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((item) => item.data)),
      );

      console.log('response catalogue from test-api: ', responseCatalogue);

      requestForwarder(
        process.env.BG_URI + '/on-search',
        responseCatalogue,
        this.httpService,
      );
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
