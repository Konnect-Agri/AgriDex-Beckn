import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { contextGenerator, generateOrder } from 'utils/generators';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class UpdateService {
  constructor(private readonly httpService: HttpService) { }

  async handleUpdateEvent(body: any, transactionId: string) {
    console.log('body in update event handler: ', body);
    try {
      const requestContext = contextGenerator(
        transactionId,
        'update',
        process.env.BAP_URI,
        process.env.BAP_ID,
        process.env.BPP_URI,
        process.env.BPP_ID,
      );

      console.log(
        'generated order: ',
        generateOrder('update', body.updates, body.order),
      );

      const message = {
        message: {
          update_target: body.updates,
          order: generateOrder('update', body.updates, body.order),
        },
      };

      const payload = {
        context: requestContext,
        message: message.message,
      };
      console.log('payload in update event handler: ', payload.message);
      const ack = await requestForwarder(
        process.env.BAP_URI,
        payload,
        this.httpService,
      );

      // console.log('ack: ', ack);
    } catch (err) {
      console.log('error in handle update event: ', err);
    }
  }
}
