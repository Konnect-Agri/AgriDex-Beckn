import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { requestForwarder } from 'apps/bap/src/utils';
import { Server, Socket } from 'socket.io';
import { SearchQuery } from './interfaces/search-query.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  port: 3003,
})
export class SearchGateway {
  constructor(private readonly httpService: HttpService) { }

  @WebSocketServer() server: Server;

  // handling a new BAP opening up a connection
  @SubscribeMessage('bapConnection')
  async handleBAPConnection(
    @MessageBody() body: string,
    @ConnectedSocket() bap: Socket,
  ) {
    console.log('bap connection body: ', body);
    bap.join('bapLobby');
  }

  // handling a search request from a client
  @SubscribeMessage('search')
  async handleSearch(
    @MessageBody() body: SearchQuery,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('search message received: ', body);
    const transactionId = Date.now() + client.id; // generating the transactionID
    client.join(transactionId); // creating a new room with this transactionID

    // TODO: shift the code from below here to a service
    try {
      const requestContext = {
        transaction_id: transactionId.toString(),
        message_id: transactionId.toString(),
        action: 'search',
        timestamp: new Date(),
        domain: 'courses_and_trainings',
        country: { code: 'IND' },
        city: { code: 'DEL' },
        core_version: '0.9.3',
      };

      // TODO: Get this filter schema reviewed
      const requestMessageCatalogue = {
        intent: {
          tags: {
            block: body.filters.block,
            district: body.filters.district,
            bank_name: body.filters.bank_name,
          },
        },
      };

      const payload = {
        context: requestContext,
        message: requestMessageCatalogue,
      };
      // emitting the request to BAP Lobby
      // this.server.to('bapLobby').emit('search', payload);

      // forwarding to BAP
      console.log('bap url from config: ', process.env.bap_uri);
      await requestForwarder(
        'http://localhost:3000/',
        payload,
        this.httpService,
      );
    } catch (err) {
      console.error('err in search gateway: ', err);
      throw new InternalServerErrorException();
    }
  }

  // remove this method later with the generic response method written below
  @SubscribeMessage('searchResponse')
  handleSearchResponse(
    @MessageBody() searchResponse: any,
    @ConnectedSocket() client: Socket,
  ) {
    // forward the response from the BAP to the client asking it
    const transaction_id = searchResponse.context.transaction_id;
    this.server.to(transaction_id).emit('searchResponse', searchResponse);
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log('new client with id: ', client.id);
  }

  @SubscribeMessage('select')
  async handleSelect(
    @MessageBody() selectQuery: any,
    @ConnectedSocket() client: Socket,
  ) {
    // the client will send the select in proper format (atleast for now, since I am writing the client myself)
    // beckn bydefault only supports order from one provider at a time, hence we'll need to create multiple,
    // orders to be sent to the protocol server, if we need to show items from multiple providers
    // in a single order we need to handle it here at the proxy level

    // forwarding the request to BAP

    const transactionId = Date.now() + client.id;
    const requestContext = {
      transaction_id: transactionId.toString(),
      message_id: transactionId.toString(),
      action: 'search',
      timestamp: new Date(),
      domain: 'courses_and_trainings',
      country: { code: 'IND' },
      city: { code: 'DEL' },
      core_version: '0.9.3',
      bap_id: 101,
      bap_uri: 'http://localhost:3000/on-search',
    };

    const payload = {
      context: requestContext,
      message: selectQuery,
    };

    this.server.to('bapLobby').emit('select', payload);
  }

  @SubscribeMessage('response')
  async handleResponse(
    @MessageBody() response: any,
    @ConnectedSocket() client: Socket,
  ) {
    const transaction_id = response.context.transaction_id;
    this.server.to(transaction_id).emit('searchResponse', response);
    this.server.in(transaction_id).socketsLeave(transaction_id);
  }
}
