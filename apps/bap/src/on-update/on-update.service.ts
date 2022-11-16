import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from '../../../../utils/utils';

@Injectable()
export class OnUpdateService {
  constructor(private readonly httpService: HttpService) { }

  async handleOnUpdate(body: any) {
    console.log('in BAP handle on update');
    console.log('body: ', body);
    try {
      return requestForwarder(process.env.PROXY_URL, body, this.httpService);
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
