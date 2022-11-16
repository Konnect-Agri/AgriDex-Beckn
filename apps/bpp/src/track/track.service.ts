import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TrackService {
  constructor(private readonly httpService: HttpService) { }

  async handleTrackRequest(body: any) {
    console.log('in BPP track');

    // call the Bank server to get the response
    const trackingInfo = await lastValueFrom(
      this.httpService
        .post(process.env.BANK_TRACK_URL, body.message)
        .pipe(map((item) => item.data)),
    );

    // forward this tracking info to BAP
    return await requestForwarder(
      body.context.bap_uri + '/on-track',
      trackingInfo,
      this.httpService,
    );
  }
}
