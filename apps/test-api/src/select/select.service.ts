import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { generateSelectMessage } from 'utils/generators';

@Injectable()
export class SelectService {
  constructor(private readonly httpService: HttpService) { }
  async handleSelectRequest(body: any) {
    try {
      const itemId = body.message.order.items[0].id;
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
        context: body.context,
        message: generateSelectMessage({
          order_id: body.message.order.id,
          provider: {
            id: body.message.order.provider.id,
            name: body.message.order.provider.id,
          },
          item: {
            id: item.id,
            name: item.loan_product,
            price: item.maximum_loan_amt,
            tags: {
              block: item.block,
              district: item.district,
              loan_tenure: item.loan_tenure,
              interest_rate: item.interest_rate,
              processing_charges: item.processing_charges,
            },
          },
          fulfillment: [
            {
              id: 'abc-fulfillment-1',
              type: 'LOAN_APPLICATION_PROCESSING',
              provider_id: body.message.order.provider.id,
              tracking: true,
              agent: {
                name: 'Jon Doe',
                phone: 1234567890,
                email: 'sample@example.com',
                gender: 'M',
              },
            },
          ],
        }),
      };

      // insert this response as a draft order in the HASURA
      const createOrderGQL = `mutation insertLoanApplication ($application: loan_applications_insert_input!){
        insert_loan_applications_one (object: $application) {
          order_id
          order_details
        }
      }`;

      const confirmedOrder = await lastValueFrom(
        this.httpService
          .post(
            process.env.HASURA_URI,
            {
              query: createOrderGQL,
              variables: {
                application: {
                  order_id: body.message.order.id,
                  order_details: body.message.order,
                },
              },
            },
            requestOptions,
          )
          .pipe(map((item) => item.data)),
      );

      console.log('confirmed order: ', confirmedOrder.errors);

      console.log('response for select in test-api: ', response);

      return response;
    } catch (err) {
      console.log('err in select service of test-api: ', err);
      throw new InternalServerErrorException(err);
    }
    return;
  }
}
