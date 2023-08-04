import { HttpService } from '@nestjs/axios';
import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';
import { createAuthorizationHeader } from '../utils/authBuilder';

@Injectable()
export class CancelService {
  constructor(private readonly httpService: HttpService) { }

  async cancelRequest(body: any) {
    console.log('in BPP cancel: ', body);

    // call the Bank server to get the response
    try {
      console.log("Cancel statred @ " + Date.now())
      console.log("BANK_URL - " + process.env.BANK_URL)
      console.log("TEST_API_URI - " + process.env.TEST_API_URI)
      console.log("Created URL - " + process.env.BANK_URL + '/wings-interface/safalIntegration/cancelApplication')
      const url = "http://117.251.193.184:8080/wings-interface/safalIntegration/cancelApplication"
      console.log("Hardcoded Url - ", url)
      const cancelRes = await lastValueFrom(
        this.httpService
        .post(url, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .pipe(map((item) => item.data)),
      );
      console.log("Response from server - ", cancelRes)
      cancelRes.context = body.context
      cancelRes.context.action = 'on_cancel';
      cancelRes.message.order.cancellation.time = new Date(Date.now()).toISOString()
      if(cancelRes.error === null) {
        delete cancelRes['error']
      }
      try {
        const authHeader = await createAuthorizationHeader(cancelRes).then(
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
            cancelRes.context.bap_uri + '/on_cancel',
            cancelRes,
            requestOptions,
          ),
        );
      } catch (err) {
        console.log('error in request forwarder: ', err);
        return new InternalServerErrorException(err);
      }

    } catch (err) {
      console.log('err in bpp cancel: ', err);
      throw new InternalServerErrorException();
    }
  }
}
