import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class SelectService {
  constructor(private readonly httpService: HttpService) {}

  async handleSelect(selectDto: any) {
    try {
      if (!selectDto.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }

      // forwarding the request to provider
      const response = await lastValueFrom(
        this.httpService
          .post(process.env.TEST_API_URI + '/select', selectDto, {
            headers: { 'Content-Type': 'application/json' },
          })
          .pipe(map((item) => item.data)),
      );

      console.log('response: ', response);

      // forward back to BAP
      try {
        response.context.action = 'on_select';
        const authHeader = await createAuthorizationHeader(response).then(
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
            response.context.bap_uri + '/on_select',
            response,
            requestOptions,
          ),
        );
      } catch (err) {
        console.log('error in request forwarder: ', err);
        return new InternalServerErrorException(err);
      }
      await requestForwarder(
        selectDto.context.bap_uri + '/on_select',
        selectDto,
        this.httpService,
      );
    } catch (err) {
      console.log('err in bpp select: ', err);
      throw new InternalServerErrorException();
    }
  }
}
