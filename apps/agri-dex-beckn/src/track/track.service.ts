import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { contextGenerator } from 'utils/generators';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class TrackService {
  constructor(private readonly httpService: HttpService) { }

  async handleTrackEvent(trackQuery: any, transactionId: string) {
    try {
      const requestContext = contextGenerator(
        transactionId,
        'track',
        process.env.BAP_URI,
        process.env.BAP_ID,
      );
      requestContext['bpp_uri'] = process.env.BPP_URI;
      requestContext['bpp_id'] = process.env.BPP_ID;

      // TODO: Get this filter schema reviewed
      const requestMessage = {
        order_id: trackQuery.order_id,
      };

      const payload = {
        context: requestContext,
        message: requestMessage,
      };

      // forwarding to BAP
      return await requestForwarder(
        process.env.BAP_URI,
        payload,
        this.httpService,
      );
    } catch (err) {
      console.error('err in track service of proxy: ', err);
      throw new InternalServerErrorException();
    }
  }
}
