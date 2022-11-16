import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { requestForwarder } from 'utils/utils';

@Injectable()
export class SelectService {
  constructor(private readonly httpService: HttpService) { }

  async handleSelectEvent(selectQuery: any, clientId: string) {
    // the client will send the select in proper format (atleast for now, since I am writing the client myself)
    // beckn bydefault only supports order from one provider at a time, hence we'll need to create multiple,
    // orders to be sent to the protocol server, if we need to show items from multiple providers
    // in a single order we need to handle it here at the proxy level

    // forwarding the request to BAP

    console.log('select query in proxy select service: ', selectQuery);
    const newMessageId = Date.now() + clientId;
    selectQuery.context.message_id = newMessageId.toString();
    selectQuery.context.timestamp = Date.now();
    selectQuery.message.order.updated_at = Date.now();
    // forwarding the request to BAP

    const ack = await requestForwarder(
      selectQuery.context.bap_uri,
      selectQuery,
      this.httpService,
    );

    console.log('ack: ', ack);
    return ack;
  }
}
