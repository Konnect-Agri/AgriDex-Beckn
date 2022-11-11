import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { requestForwarder } from 'apps/bap/src/utils';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class SelectService {
  constructor(private readonly httpService: HttpService) { }

  async handleSelect(selectDto: any) {
    try {
      if (!selectDto.context.bap_uri) {
        throw new Error('Invalid Context: bap_uri is missing');
      }

      // TODO: contact the provider with info from select
      // querying item from HASURA (just to mock an API call to bank servers)
      const itemId = selectDto.message.order.items[0].id;
      const gql: any = `{
        credit_products(where: { id: { _eq: ${itemId} } }) {
          bank_name
          block
          district
          id
          interest_rate
          loan_product
          loan_tenure
          maximum_loan_amt
          processing_charges
        }
      }`;
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.SECRET,
        },
      };
      console.log('sending query: ', gql);
      const searchResponseData = await lastValueFrom(
        this.httpService
          .post(process.env.HASURA_URI, { query: gql }, requestOptions)
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
      const item = searchResponseData.data.credit_products[0];
      console.log('item in response data: ', item);
      const response = {
        context: selectDto.context,
        message: {
          order: {
            provider: {
              id: selectDto.message.order.provider.id,
              descriptor: {
                name: selectDto.message.order.provider.id,
              },
              items: [
                {
                  id: item.id,
                  descriptor: {
                    name: item.loan_product,
                  },
                  price: item.maximum_loan_amt,
                  provider: {
                    id: selectDto.message.order.provider.id,
                  },
                  tags: {
                    block: item.block,
                    district: item.district,
                    loan_tenure: item.loan_tenure,
                    interest_rate: item.interest_rate,
                    processing_charges: item.processing_charges,
                  },
                },
              ],
              fulfillments: [
                {
                  id: 'abc-fulfillment-1',
                  type: 'LOAN_APPLICATION_PROCESSING',
                  provider_id: 'BANK 1',
                  tracking: true,
                  customer: {
                    // data here from the query resolver
                  },
                  agent: {
                    name: 'John Doe',
                    gender: 'M',
                    phone: '1234567890',
                    email: 'john@example.com',
                  },
                },
              ],
            },
          },
        },
      };
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
