import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UpdateService {
  constructor(private readonly httpService: HttpService) {}

  async handleUpdate(body: any) {
    console.log('message.order: ', body.message);
    const order = body.message.order;
    console.log('message.body.order in test-api: ', order);
    try {
      const gql = `mutation updateLoanApplication($order_id: String, $changes: loan_applications_set_input) {
        update_loan_applications (
          where: {order_id: {_eq: $order_id}},
          _set: $changes
        ) {
          affected_rows
          returning {
            order_id
            order_details
          }
        }
      }`;

      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.SECRET,
        },
      };

      let res = await lastValueFrom(
        this.httpService
          .post(
            process.env.HASURA_URI,
            {
              query: gql,
              variables: {
                order_id: order.id,
                changes: {
                  order_details: order,
                },
              },
            },
            requestOptions,
          )
          .pipe(map((item) => item.data)),
      );
      console.log(
        'res in test api update: ',
        res.data.update_loan_applications.returning,
      );
      res = res.data.update_loan_applications.returning;
      return res;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
