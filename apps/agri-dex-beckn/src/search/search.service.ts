import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { contextGenerator } from 'utils/generators';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) { }

  async handleSearchEvent(
    transactionId: string,
    block: string,
    district: string,
    bank_name: string,
  ) {
    try {
      const requestContext = contextGenerator(
        transactionId,
        'search',
        process.env.BAP_URI,
        process.env.BAP_ID,
      );

      // TODO: Get this filter schema reviewed
      const requestMessageCatalogue = {
        intent: {
          tags: {
            block: block,
            district: district,
            bank_name: bank_name,
          },
        },
      };

      const payload = {
        context: requestContext,
        message: requestMessageCatalogue,
      };

      // forwarding to BAP
      return await requestForwarder(
        process.env.BAP_URI,
        payload,
        this.httpService,
      );
    } catch (err) {
      console.error('err in search service of proxy: ', err);
      throw new InternalServerErrorException();
    }
  }
}
