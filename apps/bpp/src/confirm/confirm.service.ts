import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class ConfirmService {
  constructor(private readonly httpService: HttpService) {}

  async handleConfirm(confirmDto: any) {
    try {
      // forward the response from BPP to BAP
      if (!confirmDto.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }

      // forwarding the request to provider
      await lastValueFrom(
        this.httpService
          .post(process.env.TEST_API_URI + '/confirm', confirmDto, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((item) => item.data)),
      );

      // console.log('resp on forwarding: ', resp);

      // sending back to BAP
      confirmDto.context.action = 'on_confirm';
      try {
        const authHeader = await createAuthorizationHeader(confirmDto).then(
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
            confirmDto.context.bap_uri + '/on_confirm',
            confirmDto,
            requestOptions,
          ),
        );
      } catch (err) {
        console.log('error in request forwarder: ', err);
        return new InternalServerErrorException(err);
      }
      // await requestForwarder(
      //   confirmDto.context.bap_uri + '/on_confirm',
      //   confirmDto,
      //   this.httpService,
      // );
    } catch (err) {
      console.log('err in bpp confirm: ', err);
      throw new InternalServerErrorException();
    }
  }
}
