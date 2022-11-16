import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class ConfirmService {
  constructor(private readonly httpService: HttpService) { }

  async handleConfirmEvent(clientId: string, confirmQuery: any) {
    const newMessageId = Date.now() + clientId;
    confirmQuery.context.message_id = newMessageId.toString();
    confirmQuery.context.timestamp = Date.now();
    confirmQuery.message.order.updated_at = Date.now();

    // forwarding the request to BAP
    const ack = await requestForwarder(
      confirmQuery.context.bap_uri,
      confirmQuery,
      this.httpService,
    );

    console.log('ack: ', ack);
    return ack;
  }
}
