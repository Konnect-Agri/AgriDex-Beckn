import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class InitService {
  constructor(private readonly httpService: HttpService) { }

  async handleInit(initDto: any) {
    try {
      // forward the response from BPP to BAP
      if (!initDto.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }

      // TODO: contact provider to register shipping details
      // and populate the fullfilment object

      await requestForwarder(
        initDto.context.bap_uri + '/on-init',
        initDto,
        this.httpService,
      );
    } catch (err) {
      console.log('err in init: ', err);
      throw new InternalServerErrorException();
    }
  }
}
