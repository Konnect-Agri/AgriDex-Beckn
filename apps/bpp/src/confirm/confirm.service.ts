import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';
import { lastValueFrom, map } from 'rxjs';

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
      console.log(
        'process.env.BANK_CONFIRM_URL: ',
        process.env.BANK_CONFIRM_URL,
      );
      const resp = await lastValueFrom(
        this.httpService
          .post(process.env.TEST_API_URI + '/confirm', confirmDto, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((item) => item.data)),
      );

      console.log('resp on forwarding: ', resp);

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
