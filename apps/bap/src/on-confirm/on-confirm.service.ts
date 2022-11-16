import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from '../../../../utils/utils';

@Injectable()
export class OnConfirmService {
  constructor(private readonly httpService: HttpService) { }

  async handleConfirmResponse(confirmRes: any) {
    // listens to confirm callback from the BPP
    try {
      // forward the response from BPP to proxy
      await requestForwarder(
        process.env.PROXY_URL,
        confirmRes,
        this.httpService,
      );
    } catch (err) {
      // TODO: add logging
      console.log('err in on-confirm: ', err);
      throw new InternalServerErrorException();
    }
  }
}
