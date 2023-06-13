/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class CancelService {
  constructor(private readonly httpService: HttpService) { }

  async cancelRequest(body: any) {
    console.log('in BPP cancel: ', body);

    // call the Bank server to get the response
    try {
      const url = 'https://roots-dev.vsoftproducts.com:8082/wings-interface/safalIntegration/cancelApplication';
      const cancelRes = await lastValueFrom(
        this.httpService
        .post(url, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .pipe(map((item) => item.data)),
      );

      console.log("Logs from server (cancel) \n\n " + JSON.stringify(cancelRes) + "\n\n *****************")

      // const trackingResponse = {
      //   "context": {
      //     "transaction_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
      //     "message_id": "a9aaecca-10b7-4d19-b640-b047a7c62196",
      //     "action": "track",
      //     "timestamp": "2022-12-12T09:55:41.161Z",
      //     "domain": "dsep:courses",
      //     "version": "1.0.0",
      //     "bap_uri": "{{BAP_URI}}",
      //     "bap_id": "{{BAP_ID}}}",
      //     "bpp_id": "{{BPP_ID}}",
      //     "bpp_uri": "{{BPP_URI}}",
      //     "ttl": "PT10M"
      //   },
      //   "message": {
      //     "tracking": {
      //       "id": "125045,125069,876787,125095,125099",
      //       "url": "https://roots-dev.vsoftproducts.com:8082/wings-interface/safalIntegration/trackStatus?track=125045,125069,876787,125095,125099&districtId=2"
      //     }
      //   }
      // }

      cancelRes.context = body.context
      cancelRes.context.action = 'on_cancel';
      try {
        const authHeader = await createAuthorizationHeader(cancelRes).then(
          (res) => {
            console.log(res);
            return res;
          },
        );
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
            cancelRes.context.bap_uri + '/on_cancel',
            cancelRes,
            requestOptions,
          ),
        );
      } catch (err) {
        console.log('error in request forwarder: ', err);
        return new InternalServerErrorException(err);
      }

    } catch (err) {
      console.log('err in bpp cancel: ', err);
      throw new InternalServerErrorException();
    }
  }
}
