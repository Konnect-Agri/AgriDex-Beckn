import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class InitService {
  constructor(private readonly httpService: HttpService) { }

  async handleInitEvent(clientId: string, initQuery: any) {
    const newMessageId = Date.now() + clientId;
    initQuery.context.message_id = newMessageId.toString();
    initQuery.context.timestamp = Date.now();
    initQuery.message.order.updated_at = Date.now();
    // forwarding the request to BAP

    const ack = await requestForwarder(
      initQuery.context.bap_uri,
      initQuery,
      this.httpService,
    );

    return ack;
  }
}
