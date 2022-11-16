import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TrackService {
  constructor(private readonly httpService: HttpService) { }

  async handleTracking(order_id: string) {
    console.log('order_id: ', order_id);

    let trackingInfo: any = {
      url: 'http://tracking.uri/static_sample',
      status: 'pending processing',
    };

    const gql = `{
      order_tracking_details(where: {order_id: {_eq: ${order_id}}}) {
        status
        url
      }
    }`;

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.SECRET,
      },
    };
    // make db call here
    console.log('gql query: ', gql);
    try {
      trackingInfo = await lastValueFrom(
        this.httpService
          .post(process.env.HASURA_URI, { query: gql }, requestOptions)
          .pipe(map((item) => item.data)),
      );
    } catch (error) {
      console.log('error: ', error);
      trackingInfo = {
        error: {
          type: 'ERROR',
          code: 'ERR CODE',
          message: 'problem in db call',
        },
      };
    }

    return trackingInfo;
  }

  async handleTrackingInfo(orderId: string) {
    const gql = `query MyQuery {
      loan_applications(where: {order_id: {_eq: ${orderId}}}) {
        order_details
      }
    }`;
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.SECRET,
      },
    };

    const appForm = await lastValueFrom(
      this.httpService
        .post(process.env.HASURA_URI, { query: gql }, requestOptions)
        .pipe(map((item) => item.data)),
    );

    return appForm;
  }
}
