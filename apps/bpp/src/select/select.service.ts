import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'apps/bap/src/utils';

@Injectable()
export class SelectService {
  constructor(private readonly httpService: HttpService) { }

  async handleSelect(selectDto: any) {
    try {
      if (!selectDto.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }

      // TODO: contact the provider with info from select

      // forward back to BAP
      await requestForwarder(
        selectDto.context.bap_uri,
        selectDto,
        this.httpService,
      );
    } catch (err) {
      console.log('err in bpp select: ', err);
      throw new InternalServerErrorException();
    }
  }
}
