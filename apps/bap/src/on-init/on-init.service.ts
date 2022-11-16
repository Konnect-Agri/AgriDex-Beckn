import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from '../../../../utils/utils';

@Injectable()
export class OnInitService {
  constructor(private readonly httpService: HttpService) { }

  async handleOnInitResponse(initRes: any) {
    // listens to init callback from the BPP
    try {
      // forward the response from BPP to proxy
      await requestForwarder(process.env.PROXY_URL, initRes, this.httpService);
    } catch (err) {
      // TODO: add logging
      console.log('err in on-init: ', err);
      throw new InternalServerErrorException();
    }
  }
}
