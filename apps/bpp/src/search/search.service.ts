/* eslint-disable prettier/prettier */
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
      console.log("Search statred @ " + Date.now())
      console.log("BANK_URL - " + process.env.BANK_URL)
      console.log("TEST_API_URI - " + process.env.TEST_API_URI)
      console.log("Created URL - " + process.env.BANK_URL + '/wings-interface/safalIntegration/getProductInformation')
      const url = "http://117.251.193.184:8080/wings-interface/safalIntegration/getProductInformation"
      console.log("Hardcoded Url - ", url)
      const responseCatalog = await lastValueFrom(
        this.httpService
          .post(url, searchDTO, {
            headers: {
              'Content-Type': 'application/json',
            },
          })  

          .pipe(map((item) => item.data)),
      );
      (responseCatalog as any).context = searchDTO.context;
      console.log("\n\n\n\n\n\n\nresponseCatalog - ", responseCatalog)
      responseCatalog.context.action = 'on_search';
      if(responseCatalog.error === null) {
        delete responseCatalog['error']
      }
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
