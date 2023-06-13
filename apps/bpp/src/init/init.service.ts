/* eslint-disable prettier/prettier */
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
      console.log("Init statred @ " + Date.now())

      const url = 'https://roots-dev.vsoftproducts.com:8082/wings-interface/safalIntegration/initiateSTLoanApplication';
      // const url2 = process.env.TEST_API_URI + "/init"
      const resp = await lastValueFrom(
        this.httpService
          .post(url, initDto, {
            headers: { 'Content-Type': 'application/json' },
          })
          .pipe(map((item) => item.data)),
      );

      console.log('response catalogue from bank server: ', resp);
    
      resp.context.action = 'on_init';
      if(resp.error === null) {
        delete resp['error']
      }
      if(resp.message.order.fulfillments[0].id === null){
        delete resp.message.order.fulfillments[0].id
        
      } 
      try {
        const authHeader = await createAuthorizationHeader(resp).then(
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
            resp.context.bap_uri + '/on_init',
            resp,
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
