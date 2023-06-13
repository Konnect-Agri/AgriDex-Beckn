/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class TrackService {
  constructor(private readonly httpService: HttpService) { }

  async handleTrackRequest(body: any) {
    console.log('in BPP track: ', body);

    // call the Bank server to get the response
    try {
      const url = 'https://roots-dev.vsoftproducts.com:8082/wings-interface/safalIntegration/trackApplicationStatus';
      const trackingResponse = await lastValueFrom(
        this.httpService
        .post(url, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .pipe(map((item) => item.data)),
      );

      console.log("Logs from server (track) \n\n " + JSON.stringify(trackingResponse) + "\n\n *****************")

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

      trackingResponse.context = body.context
      trackingResponse.context.action = 'on_track';
      if(trackingResponse.error === null) {
        delete trackingResponse['error']
      }
      try {
        const authHeader = await createAuthorizationHeader(trackingResponse).then(
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
            trackingResponse.context.bap_uri + '/on_track',
            trackingResponse,
            requestOptions,
          ),
        );
      } catch (err) {
        console.log('error in request forwarder: ', err);
        return new InternalServerErrorException(err);
      }

      // forward this tracking info to BAP
      // return await requestForwarder(
      //   body.context.bap_uri + '/on_track',
      //   { context: body.context, message: trackingInfo },
      //   this.httpService,
      // );
    } catch (err) {
      console.log('err in bpp track: ', err);
      throw new InternalServerErrorException();
    }
  }
}
