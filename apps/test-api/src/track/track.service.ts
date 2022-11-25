import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TrackService {
  constructor(private readonly httpService: HttpService) { }

  async getAllTrackings() {
    try {
      const gql = `
      query MyQuery {
        order_tracking_details {
          status
          order_id
          review
          url
        }
      }`;

      console.log('gql in track: ', gql);

      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.SECRET,
        },
      };

      const response = await lastValueFrom(
        this.httpService
          .post(process.env.HASURA_URI, { query: gql }, requestOptions)
          .pipe(map((item) => item.data)),
      );

      return response;
    } catch (err) {
      console.log('Err in get all trackings: ', err);
    }
  }

  async handleTrackingInfo(orderId: string) {
    const gql = `
    query MyQuery {
      order_tracking_details( where: {
        order_id: { _eq: "${orderId}" }
      } ) {
        status
        url
      }
    }`;

    console.log('gql in track: ', gql);

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

    return {
      status: appForm.data.order_tracking_details[0].status,
      url: appForm.data.order_tracking_details[0].url,
    };
  }
}
