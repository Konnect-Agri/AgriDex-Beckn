import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO } from './dto/on-search.dto';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class OnSearchService {
  constructor(private readonly httpService: HttpService) {}

  async handleOnSearch(searchDTO: SearchDTO) {
    console.log('in BPP');
    try {
      console.log('in bpp');

      // forwarding request to providers
      const responseCatalog = await lastValueFrom(
        this.httpService
          .post(process.env.TEST_API_URI + '/search', searchDTO, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((item) => item.data)),
      );

      console.log('response catalogue from test-api: ', responseCatalog);

      try {
        const authHeader = await createAuthorizationHeader(
          responseCatalog,
        ).then((res) => {
          console.log(res);
          return res;
        });
        console.log('auth header: ', authHeader);

        const requestOptions = {
          headers: {
            'Content-Type': 'application/json',
            authorization: authHeader,
          },
          withCredentials: true,
          mode: 'cors',
        };
        console.log('calling request forwarder');
        await lastValueFrom(
          this.httpService.post(
            responseCatalog?.context?.bap_uri + '/on_search',
            responseCatalog,
            requestOptions,
          ),
        );
      } catch (err) {
        console.error('err: ', err);
        return new InternalServerErrorException(err);
      }

      // requestForwarder(
      //   responseCatalog?.context?.bap_uri + '/on_search',
      //   responseCatalog,
      //   this.httpService,
      // );
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
