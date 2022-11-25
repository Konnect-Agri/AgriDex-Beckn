import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getUserOrders(body: any) {
    console.log('in user orders');
    const gql = `query getClientOrders {
      order_client_mappings(where: {client_id: {_eq: "${body.client_id}"}}) {
        client_id
        order_id
      }
    }
    `;
    console.log('gql in user orders: ', gql);
    const orders = await lastValueFrom(
      this.httpService
        .post(
          process.env.HASURA_URI,
          {
            query: gql,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': process.env.SECRET,
            },
          },
        )
        .pipe(map((item) => item.data)),
    );
    console.log('orders: ', orders);
    return orders;
  }
}
