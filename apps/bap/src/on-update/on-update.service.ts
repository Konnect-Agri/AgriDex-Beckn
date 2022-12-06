import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { requestForwarder } from '../../../../utils/utils';

@Injectable()
export class OnUpdateService {
  constructor(private readonly httpService: HttpService) { }

  async handleOnUpdate(body: any) {
    console.log('in BAP handle on update');
    console.log('body: ', body);
    try {
      // return requestForwarder(process.env.PROXY_URL, body, this.httpService);
      const res = await lastValueFrom(
        this.httpService
          .post(process.env.PROXY_URL, body, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((item) => item.data)),
      );
      console.log('res bap on-update: ', res);
      return res;
    } catch (err) {
      console.log('err in on-update bap: ', err);
      throw new InternalServerErrorException();
    }
  }
}
