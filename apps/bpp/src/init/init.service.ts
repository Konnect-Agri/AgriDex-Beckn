import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { requestForwarder } from 'utils/utils';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class InitService {
  constructor(private readonly httpService: HttpService) {}

  async handleInit(initDto: any) {
    try {
      // forward the response from BPP to BAP
      if (!initDto.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }

      // TODO: contact provider to register shipping details
      // and populate the fullfilment object
      console.log('in init service of bpp!');

      // TODO: integrate actual BANK APIs here
      // const resp = await lastValueFrom(
      //   this.httpService
      //     .post(process.env.TEST_API_URI + '/init', initDto, {
      //       headers: { 'Content-Type': 'application/json' },
      //     })
      //     .pipe(map((item) => item.data)),
      // );

      initDto.context.action = 'on_init';

      try {
        const authHeader = await createAuthorizationHeader(initDto).then(
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
            initDto.context.bap_uri + '/on_init',
            initDto,
            requestOptions,
          ),
        );
      } catch (err) {
        console.log('error in request forwarder: ', err);
        return new InternalServerErrorException(err);
      }
    } catch (err) {
      console.log('err in init: ', err);
      throw new InternalServerErrorException();
    }
  }
}
