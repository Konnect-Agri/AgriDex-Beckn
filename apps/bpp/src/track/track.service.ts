import { HttpService } from '@nestjs/axios';
import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TrackService {
  constructor(private readonly httpService: HttpService) { }

  async handleTrackRequest(body: any) {
    console.log('in BPP track: ', body);

    // call the Bank server to get the response
    try {
      const trackingInfo = await lastValueFrom(
        this.httpService
          .get(process.env.TEST_API_URI + '/track/' + body.message.order_id)
          .pipe(map((item) => item.data)),
      );

      // forward this tracking info to BAP
      return await requestForwarder(
        body.context.bap_uri + '/on-track',
        { context: body.context, message: trackingInfo },
        this.httpService,
      );
    } catch (err) {
      console.log('err in bpp track: ', err);
      throw new InternalServerErrorException();
    }
  }
}
