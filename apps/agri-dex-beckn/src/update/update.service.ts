import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { contextGenerator } from 'utils/generators';

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
      );

      const message = {
        message: {
          update_target: body.update_targets,
          order: {},
        },
      };
    } catch (err) {
      console.log('error in handle update event: ', err);
    }
  }
}
