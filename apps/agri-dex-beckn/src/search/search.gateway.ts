import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import ContextInterface from 'dsep-beckn-schema/schemas/Context.interface';
import { ACTIONS } from 'dsep-beckn-schema/schemas/types/actions.enum';
import { lastValueFrom, map } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { SearchQuery } from './interfaces/search-query.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SearchGateway {
  constructor(private readonly httpService: HttpService) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('bapConnection')
  async handleBAPConnection(
    @MessageBody() body: string,
    @ConnectedSocket() bap: Socket,
  ) {
    console.log('bap connection body: ', body);
    bap.join('bapLobby');
  }

  @SubscribeMessage('search')
  async handleSearch(
    @MessageBody() body: SearchQuery,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('search message received: ', body);
    const transactionId = Date.now() + client.id;
    client.join(transactionId);
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
        bap_id: 101,
        bap_uri: 'http://localhost:3000/on-search',
      };
      // TODO: Get this filter schema reviewed
      const requestMessageCatalogue = {
        providers: [
          {
            id: body.filters.bank_name,
            locations: [
              {
                id: 'block',
                descriptor: {
                  name: body.filters.block,
                },
              },
              {
                id: 'district',
                descriptor: {
                  name: body.filters.district,
                },
              },
            ],
          },
        ],
      };
      const payload = {
        context: requestContext,
        message: {
          catalogue: requestMessageCatalogue,
        },
      };
      // emitting the request to BAP Lobby
      this.server.to('bapLobby').emit('search', payload);
    } catch (err) {
      console.error('err: ', err);
      throw new InternalServerErrorException();
    }
  }

  @SubscribeMessage('searchResponse')
  handleResponse(
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
}
