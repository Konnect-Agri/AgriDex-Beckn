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

    } catch (err) {
      console.log('err in bpp track: ', err);
      throw new InternalServerErrorException();
    }
  }
}
