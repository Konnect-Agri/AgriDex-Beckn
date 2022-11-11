import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OnSelectService {
  constructor(private readonly httpService: HttpService) { }

  // TODO: add selectDTO
  async handleSelectResponse(selectRes: any) {
    // listens to response from the BPP

    // TODO: Verify the request structure
    try {
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // forwarding the response to the proxy
      await lastValueFrom(
        this.httpService.post(process.env.PROXY_URL, selectRes, requestOptions),
      );
    } catch (err) {
      console.log('err in on-select', err);
      throw new InternalServerErrorException();
    }
  }
}
