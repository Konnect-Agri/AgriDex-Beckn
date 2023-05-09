import { HttpService } from '@nestjs/axios';
import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class TrackService {
  constructor(private readonly httpService: HttpService) {}

  async handleTrackRequest(body: any) {
    console.log('in BPP track: ', body);

    // call the Bank server to get the response
    try {
      const trackingInfo = await lastValueFrom(
        this.httpService
          .get(process.env.TEST_API_URI + '/track/' + body.message.order_id)
          .pipe(map((item) => item.data)),
      );

      const onTrackResp = {
        context: body.context,
        message: {
          tracking: {
            id: body.message.order_id,
          },
        },
      };
      if (trackingInfo.url) {
        onTrackResp.message.tracking['url'] = encodeURI(trackingInfo.url);
        onTrackResp.message.tracking['status'] = 'active';
      } else {
        onTrackResp.message.tracking['status'] = 'inactive';
      }

      onTrackResp.context.action = 'on_track';
      try {
        const authHeader = await createAuthorizationHeader(onTrackResp).then(
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
            onTrackResp.context.bap_uri + '/on_track',
            onTrackResp,
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
