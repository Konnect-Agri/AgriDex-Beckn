import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { UpdateService } from '../update/update.service';

@Injectable()
export class ConfirmService {
  constructor(
    private readonly updateService: UpdateService,
    private readonly httpService: HttpService,
  ) { }
  async handleConfirm(body: any, host: string) {
    console.log('in confirm service');
    // const { order_id, review, status } = body;
    console.log('body: ', body);
    // make a db call to update the order
    // const confirmedOrder = await this.updateService.handleUpdate(body);
    // console.log('confirmedOrder: ', confirmedOrder);
    // code to make DB call to update the tracking here
    const createTrackingGQL = `mutation insertTracking {
      insert_order_tracking_details_one (object: {
        order_id: ${body.message.order.id},
        review: "",
        status: "pending for processing",
        url: "${host}/track/${body.message.order.id}"
      }) {
        order_id
      }
    }`;

    // console.log('body.message.order: ', JSON.parse(body.message.order));

    const createOrderGQL = `mutation insertLoanApplication {
      insert_loan_applications_one(object: {order_id: "${body.message.order.id}", order_details: {${body.message.order}}}) {
        order_id
        order_details
      }
    }`;

    console.log('createOrderGQL: ', createOrderGQL);

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.SECRET,
      },
      query: createOrderGQL,
    };

    // calling hasura to save the order
    const confirmedOrder = await lastValueFrom(
      this.httpService
        .post(process.env.HASURA_URI, { query: createOrderGQL }, requestOptions)
        .pipe(map((item) => item.data)),
    );

    console.log('confirmed order: ', confirmedOrder.errors);

    // creating a new tracking ticket corresponding this order
    const orderTracking = await lastValueFrom(
      this.httpService
        .post(
          process.env.HASURA_URI,
          { query: createTrackingGQL },
          requestOptions,
        )
        .pipe(map((item) => item.data)),
    );
    console.log('orderTracking: ', orderTracking);
    // return confirmedOrder;
  }
}
