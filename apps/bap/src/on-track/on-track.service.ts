import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from '../utils';

@Injectable()
export class OnTrackService {
  constructor(private readonly httpService: HttpService) { }

  async handleOnTrack(body: any) {
    console.log('in BAP on-track');
    console.log('body: ', body);

    try {
      requestForwarder(process.env.PROXY_URL, body, this.httpService);
    } catch (err) {
      console.error('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
