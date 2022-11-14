import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'apps/bap/src/utils';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UpdateService {
  constructor(private readonly httpService: HttpService) { }

  async handleUpdate(body: any) {
    console.log('in update bpp');
    try {
      if (!body.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // forward to bank server
      const updateResp = await lastValueFrom(
        this.httpService
          .post(process.env.BANK_UPDATE_URL, body, requestOptions)
          .pipe(map((item) => item.data)),
      );

      // sending back to BAP
      return requestForwarder(
        body.context.bap_uri + '/on-update',
        updateResp,
        this.httpService,
      );
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
