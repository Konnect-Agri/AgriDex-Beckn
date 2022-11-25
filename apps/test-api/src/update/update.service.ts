import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UpdateService {
  constructor(private readonly httpService: HttpService) { }

  async handleUpdate(body: any) {
    console.log('message.order: ', body.message);
    const order = body.message.order;
    console.log('message.body.order in test-api: ', order);
    try {
      //     const gql = `mutation updateLoanApplication {
      //       update_loan_applications_by_pk (
      //         pk_columns: {order_id: ${order.id}}
      //         _set:{order_details: ${order}
      //   } ) {
      //     order_id,
      //     order_details
      //   }
      // }
      //     `;

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
      // const gql = `mutation update_a_loan_application {
      //   update_loan_applications_by_pk (
      //     pk_columns: {order_id: "${order.id}" }
      //     _set: { order_details: "${JSON.stringify(order)}" }
      //   ) {
      //     order_id
      //     order_details
      //   }
      // }`;

      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.SECRET,
        },
      };

      const res = await lastValueFrom(
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
      return res.order_details;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
