import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class ApplicationsService {
  constructor(private readonly httpService: HttpService) { }

  async handleReview(body: any, host: string, order_id: string) {
    const { review, status } = body;
    // code to make DB call to update the tracking here

    // const createTrackingGQL = `mutation updateApplicationTracking {
    //   update_order_tracking_details_by_pk (
    //     pk_columns: {order_id: ${order_id}}
    //     _set: {
    //       review: ${review},
    //       url: ${host}/track/${order_id},
    //       status: ${status}
    //     }
    //   ) {
    //     order_id
    //     review
    //     status
    //     url
    //   }
    // }
    // `;

    const createTrackingGQL = `mutation updateApplicationTracking($order_id: String, $changes: order_tracking_details_set_input) {
      update_order_tracking_details(
        where: {order_id: {_eq: $order_id}},
        _set: $changes
      ) {
        affected_rows
        returning {
          order_id
          review
          status
          url
        }
      }
    }`;

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.SECRET,
      },
    };

    try {
      const resp = await lastValueFrom(
        this.httpService
          .post(
            process.env.HASURA_URI,
            {
              query: createTrackingGQL,
              variables: {
                order_id: order_id,
                changes: {
                  review: review,
                  url: `${host}/track/${order_id}`,
                  status: `${status}`,
                },
              },
            },
            requestOptions,
          )
          .pipe(map((item) => item.data)),
      );
      console.log('resp: ', resp);

      return {
        message: `Review updated successfully for ${order_id}`,
      };
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }

  async getAllApplications() {
    const gql = `query MyQuery {
      loan_applications {
        order_id
        order_details
      }
    }`;

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.SECRET,
      },
    };
    // simulate DB call to get all applications
    const applications = await lastValueFrom(
      this.httpService
        .post(process.env.HASURA_URI, { query: gql }, requestOptions)
        .pipe(map((item) => item.data)),
    );

    return applications;
  }
}
