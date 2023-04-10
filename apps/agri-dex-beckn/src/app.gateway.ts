import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { lastValueFrom, map } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ConfirmService } from './confirm/confirm.service';
import { InitService } from './init/init.service';
import { SearchQuery } from './search/interfaces/search-query.interface';
import { SearchService } from './search/search.service';
import { SelectService } from './select/select.service';
import { TrackService } from './track/track.service';
import { UpdateService } from './update/update.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  port: process.env.AGRI_DEX_BECKN_PORT,
})
export class AppGateway {
  constructor(
    private readonly searchService: SearchService,
    private readonly selectService: SelectService,
    private readonly initService: InitService,
    private readonly confirmService: ConfirmService,
    private readonly trackService: TrackService,
    private readonly updateService: UpdateService,
    private readonly httpService: HttpService,
  ) {}

  @WebSocketServer() server: Server;

  // new connection handler
  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log('new client with id: ', client.id);
  }

  // response handler
  @SubscribeMessage('response')
  async handleResponse(@MessageBody() response: any) {
    console.log('response method');
    console.log('action: ', response.context.action);
    const transaction_id = response.context.transaction_id;
    if (response.context.action === 'confirm') {
      console.log('in if!');
      const gql = `mutation insertClientOrderMapping ($application: order_client_mappings_insert_input!){
        insert_order_client_mappings_one (object: $application) {
          order_id
          client_id
        }
      }`;
      const aadhar_email_maps = {
        '331081000000': 'farmer-1',
        '334130000000': 'farmer-2',
        '756744000000': 'farmer-3',
        '634896000000': 'farmer-4',
        '860668000000': 'farmer-5',
        '727414000000': 'farmer-6',
        '512968000000': 'farmer-7',
        '519193000000': 'farmer-8',
      };

      try {
        console.log('response: ', response.message.order.loan_application_doc);
        const res = await lastValueFrom(
          this.httpService
            .post(
              process.env.HASURA_URI,
              {
                query: gql,
                variables: {
                  application: {
                    order_id: response.message.order.id,
                    client_id:
                      aadhar_email_maps[
                      response.message.order.loan_application_doc
                        .applicant_details.basic_details.aadhar_number
                      ],
                  },
                },
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-hasura-admin-secret': process.env.SECRET,
                },
              },
            )
            .pipe(map((item) => item.data)),
        );
        console.log('res: ', res);
      } catch (err) {
        console.log('err while creating client order mapping: ', err);
      }
    } else if (response.context.action === 'update') {
      this.server.to(transaction_id).emit('response', {
        context: {
          action: 'update',
        },
        message: 'Update Recorded',
      });
      return;
    }
    this.server.to(transaction_id).emit('response', response);
    this.server.in(transaction_id).socketsLeave(transaction_id);
  }

  // action handlers
  @SubscribeMessage('search')
  async handleSearch(
    @MessageBody() body: SearchQuery,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('search message received: ', body);
    const transactionId = Date.now() + client.id; // generating the transactionID
    client.join(transactionId); // creating a new room with this transactionID
    const { block, district, bank_name } = body.filters;
    return this.searchService.handleSearchEvent(
      transactionId,
      block,
      district,
      bank_name,
    );
  }

  @SubscribeMessage('select')
  async handleSelect(
    @MessageBody() selectQuery: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.join(selectQuery.context.transaction_id);
      return this.selectService.handleSelectEvent(selectQuery, client.id);
    } catch (err) {
      console.error('err: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  @SubscribeMessage('init')
  async handleInit(
    @MessageBody() initQuery: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('init query: ', initQuery);
    try {
      client.join(initQuery.context.transaction_id);
      return this.initService.handleInitEvent(client.id, initQuery);
    } catch (err) {
      client.emit('error: ', err);
      client._error(err);
    }
  }

  @SubscribeMessage('confirm')
  async handleConfirm(
    @MessageBody() confirmQuery: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('confirm query: ', confirmQuery);
    try {
      client.join(confirmQuery.context.transaction_id);
      return this.confirmService.handleConfirmEvent(client.id, confirmQuery);
    } catch (err) {
      client.emit('error: ', err);
      client._error(err);
    }
  }

  @SubscribeMessage('track')
  async handleTrack(
    @MessageBody() trackQuery: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('track query: ', trackQuery);
    try {
      const transactionId = Date.now() + client.id;
      client.join(transactionId);
      return this.trackService.handleTrackEvent(trackQuery, transactionId);
    } catch (err) {
      client.emit('error: ', err);
      client._error(err);
    }
  }

  @SubscribeMessage('update')
  async handleUpdate(
    @MessageBody() updateQuery: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('update query: ', updateQuery);
    try {
      const transaction_id = Date.now() + client.id;
      client.join(transaction_id);
      return this.updateService.handleUpdateEvent(updateQuery, transaction_id);
    } catch (err) {
      client.emit('error: ', err);
      client._error(err);
    }
  }
}
