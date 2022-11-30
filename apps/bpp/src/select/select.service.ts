import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class SelectService {
  constructor(private readonly httpService: HttpService) { }

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

      // forward back to BAP
      await requestForwarder(
        selectDto.context.bap_uri + '/on-select',
        response,
        this.httpService,
      );
    } catch (err) {
      console.log('err in bpp select: ', err);
      throw new InternalServerErrorException();
    }
  }
}
