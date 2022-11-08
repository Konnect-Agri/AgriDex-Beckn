import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'apps/bap/src/utils';

@Injectable()
export class ConfirmService {
  constructor(private readonly httpService: HttpService) { }

  async handleConfirm(confirmDto: any) {
    try {
      // forward the response from BPP to BAP
      if (!confirmDto.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }

      // TODO: contact the provider to register payment details

      // sending back to BAP
      await requestForwarder(
        confirmDto.context.bap_uri + '/on-confirm',
        confirmDto,
        this.httpService,
      );
    } catch (err) {
      console.log('err in bpp confirm: ', err);
      throw new InternalServerErrorException();
    }
  }
}
