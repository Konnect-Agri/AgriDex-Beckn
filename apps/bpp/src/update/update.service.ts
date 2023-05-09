import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class UpdateService {
  constructor(private readonly httpService: HttpService) {}

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
          .post(process.env.TEST_API_URI + '/update', body, requestOptions)
          .pipe(map((item) => item.data)),
      );
      console.log('update resp in BPP: ', updateResp);
      // sending back to BAP
      const onUpdateResp = {
        context: body.context,
        message: {
          order: updateResp[0].order_details,
        },
      };
      console.log('onUpdateResp: ', onUpdateResp);
      try {
        onUpdateResp.context.action = 'on_update';
        const authHeader = await createAuthorizationHeader(onUpdateResp).then(
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
            onUpdateResp.context.bap_uri + '/on_update',
            onUpdateResp,
            requestOptions,
          ),
        );
      } catch (err) {
        console.log('error in request forwarder: ', err);
        return new InternalServerErrorException(err);
      }
      // return requestForwarder(
      //   body.context.bap_uri + '/on_update',
      //   onUpdateResp,
      //   this.httpService,
      // );
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
