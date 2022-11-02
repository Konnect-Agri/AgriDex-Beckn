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

  @SubscribeMessage('search')
  async handleSearch(
    @MessageBody() body: SearchQuery,
    @ConnectedSocket() client: Socket,
  ) {
    const transactionId = Date.now();
    client.join(transactionId.toString());
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
        bap_uri: 'http://localhost:3000',
      };

      const requestMessageCatalogue = {
        descriptor: {
          name: body.query,
        },
        // TODO: add filters after review from Ravi
      };
      const requestBody = {
        context: requestContext,
        message: {
          catalogue: requestMessageCatalogue,
        },
      };
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const responseData = await lastValueFrom(
        this.httpService
          .post('http://localhost:3000/search', requestBody, requestOptions)
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
      //sending the response to the corresponding client
      this.server
        .to(transactionId.toString())
        .emit('searchResponse: ', responseData);
    } catch (err) {
      console.error('err: ', err);
      throw new InternalServerErrorException();
    }
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log('new client with id: ', client.id);
  }
}
