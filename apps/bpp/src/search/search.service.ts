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
      const url = 'https://roots-dev.vsoftproducts.com:8082/wings-interface/safalIntegration/getProductInformation';
      // const url = 'process.env.TEST_API_URI + '/search''
      const responseCatalog = await lastValueFrom(
        this.httpService
          .post(url, searchDTO, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((item) => item.data)),
      );

      // const responseCatalog = {
      //   context: {
      //     transaction_id: 'a9aaecca-10b7-4d19-b640-b047a7c62196',
      //     message_id: 'a9aaecca-10b7-4d19-b640-b047a7c62196',
      //     action: 'search',
      //     timestamp: '2022-12-12T09:55:41.161Z',
      //     domain: 'dsep:courses',
      //     version: '1.0.0',
      //     bap_uri: '{{BAP_URI}}',
      //     bap_id: '{{BAP_ID}}}',
      //     bpp_id: '{{BPP_ID}}',
      //     bpp_uri: '{{BPP_URI}}',
      //     ttl: 'PT10M',
      //   },
      //   message: {
      //     catalog: {
      //       descriptor: {
      //         name: 'Catalogue for search query with block:chikkaballapur , district:CHIKKABALLAPUR',
      //       },
      //       providers: [
      //         {
      //           id: '30',
      //           descriptor: {
      //             name: 'Kolar and Chikkballapura DCC Bank Ltd., Kolar',
      //           },
      //           items: [
      //             {
      //               id: '601',
      //               descriptor: { name: 'ST-KCC Loan' },
      //               provider: { id: '30' },
      //               tags: [
      //                 {
      //                   block: 'chikkaballapur',
      //                   district: 'CHIKKABALLAPUR',
      //                   dispaly: true,
      //                   loan_tenure: 12,
      //                   max_loan_tenure: 60,
      //                   interest_rate: 10,
      //                   fromSlab: 1,
      //                   toSlab: 1000000000000000,
      //                   effectiveDate: '2020-04-01',
      //                   processing_charges: 0,
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //         {
      //           id: '30',
      //           descriptor: {
      //             name: 'Kolar and Chikkballapura DCC Bank Ltd., Kolar',
      //           },
      //           items: [
      //             {
      //               id: '601',
      //               descriptor: { name: 'ST-KCC Loan' },
      //               provider: { id: '30' },
      //               tags: [
      //                 {
      //                   block: 'chikkaballapur',
      //                   district: 'CHIKKABALLAPUR',
      //                   dispaly: true,
      //                   loan_tenure: 12,
      //                   max_loan_tenure: 60,
      //                   interest_rate: 8.5,
      //                   fromSlab: 1,
      //                   toSlab: 1000000000000000,
      //                   effectiveDate: '2023-04-08',
      //                   processing_charges: 0,
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //         {
      //           id: '30',
      //           descriptor: {
      //             name: 'Kolar and Chikkballapura DCC Bank Ltd., Kolar',
      //           },
      //           items: [
      //             {
      //               id: '709',
      //               descriptor: { name: 'KCC-NON BOR' },
      //               provider: { id: '30' },
      //               tags: [
      //                 {
      //                   block: 'chikkaballapur',
      //                   district: 'CHIKKABALLAPUR',
      //                   dispaly: true,
      //                   loan_tenure: 12,
      //                   max_loan_tenure: 36,
      //                   interest_rate: 9,
      //                   fromSlab: 1,
      //                   toSlab: 1000000000000000,
      //                   effectiveDate: '2020-04-01',
      //                   processing_charges: 0,
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   },
      // };

      console.log('response catalogue from bank server: ', responseCatalog);
      (responseCatalog as any).context = searchDTO.context;
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
