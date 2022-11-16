import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UpdateService {
  constructor(private readonly httpService: HttpService) { }

  async handleUpdate(body: any) {
    const order = body.message.order;
    try {
      const gql = `mutation updateLoanApplication {
        update_loan_applications_by_pk (
          pk_columns: {order_id: ${order.id}}
          _set:{order_details: ${order}
    } ) {
      order_id,
      order_details
    }
  }
      `;
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.SECRET,
        },
      };

      const res = await lastValueFrom(
        this.httpService
          .post(process.env.HASURA_URI, { query: gql }, requestOptions)
          .pipe(map((item) => item.data)),
      );
      console.log('res in test api update: ', res);
      return res.order_details;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
