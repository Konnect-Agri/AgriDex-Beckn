// import { HttpService } from '@nestjs/axios';
// import { InternalServerErrorException } from '@nestjs/common';
// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { requestForwarder } from 'apps/bap/src/utils';
// import { Server, Socket } from 'socket.io';
// import { SearchQuery } from './interfaces/search-query.interface';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
//   port: 3003,
// })
// export class SearchGateway {
//   constructor(private readonly httpService: HttpService) { }

//   @WebSocketServer() server: Server;

//   // handling a search request from a client
//   @SubscribeMessage('search')
//   async handleSearch(
//     @MessageBody() body: SearchQuery,
//     @ConnectedSocket() client: Socket,
//   ) {
//     console.log('search message received: ', body);
//     const transactionId = Date.now() + client.id; // generating the transactionID
//     client.join(transactionId); // creating a new room with this transactionID

//     // TODO: shift the code from below here to a service
//     try {
//       const requestContext = {
//         transaction_id: transactionId.toString(),
//         message_id: transactionId.toString(),
//         action: 'search',
//         timestamp: new Date(),
//         domain: 'courses_and_trainings',
//         country: { code: 'IND' },
//         city: { code: 'DEL' },
//         core_version: '0.9.3',
//       };

//       // TODO: Get this filter schema reviewed
//       const requestMessageCatalogue = {
//         intent: {
//           tags: {
//             block: body.filters.block,
//             district: body.filters.district,
//             bank_name: body.filters.bank_name,
//           },
//         },
//       };

//       const payload = {
//         context: requestContext,
//         message: requestMessageCatalogue,
//       };
//       // emitting the request to BAP Lobby
//       // this.server.to('bapLobby').emit('search', payload);

//       // forwarding to BAP
//       console.log('bap url from config: ', process.env.bap_uri);
//       await requestForwarder(
//         'http://localhost:3000/',
//         payload,
//         this.httpService,
//       );
//     } catch (err) {
//       console.error('err in search gateway: ', err);
//       throw new InternalServerErrorException();
//     }
//   }

//   // remove this method later with the generic response method written below
//   @SubscribeMessage('searchResponse')
//   handleSearchResponse(@MessageBody() searchResponse: any) {
//     // forward the response from the BAP to the client asking it
//     const transaction_id = searchResponse.context.transaction_id;
//     this.server.to(transaction_id).emit('searchResponse', searchResponse);
//   }

//   handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
//     console.log('new client with id: ', client.id);
//   }

//   @SubscribeMessage('select')
//   async handleSelect(
//     @MessageBody() selectQuery: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     // the client will send the select in proper format (atleast for now, since I am writing the client myself)
//     // beckn bydefault only supports order from one provider at a time, hence we'll need to create multiple,
//     // orders to be sent to the protocol server, if we need to show items from multiple providers
//     // in a single order we need to handle it here at the proxy level

//     // forwarding the request to BAP
//     try {
//       const newMessageId = Date.now() + client.id;
//       selectQuery.context.message_id = newMessageId.toString();
//       selectQuery.context.timestamp = Date.now();
//       selectQuery.message.order.id = Date.now().toString();
//       selectQuery.message.order.created_at = Date.now();
//       selectQuery.message.order.updated_at = Date.now();
//       // forwarding the request to BAP

//       const ack = await requestForwarder(
//         selectQuery.context.bap_uri,
//         selectQuery,
//         this.httpService,
//       );

//       console.log('ack: ', ack);
//       client.join(selectQuery.context.transaction_id);
//     } catch (err) {
//       client.emit('error: ', err);
//       client._error(err);
//     }
//   }

//   @SubscribeMessage('response')
//   async handleResponse(@MessageBody() response: any) {
//     console.log('response methiod');
//     const transaction_id = response.context.transaction_id;
//     this.server.to(transaction_id).emit('response', response);
//     this.server.in(transaction_id).socketsLeave(transaction_id);
//   }

//   @SubscribeMessage('init')
//   async handleInit(
//     @MessageBody() initQuery: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     console.log('init query: ', initQuery);
//     try {
//       const newMessageId = Date.now() + client.id;
//       initQuery.context.message_id = newMessageId.toString();
//       initQuery.context.timestamp = Date.now();
//       initQuery.message.order.created_at = Date.now();
//       initQuery.message.order.updated_at = Date.now();
//       // forwarding the request to BAP

//       const ack = await requestForwarder(
//         initQuery.context.bap_uri,
//         initQuery,
//         this.httpService,
//       );

//       console.log('ack: ', ack);
//       client.join(initQuery.context.transaction_id);
//     } catch (err) {
//       client.emit('error: ', err);
//       client._error(err);
//     }
//   }
//   @SubscribeMessage('confirm')
//   async handleConfirm(
//     @MessageBody() confirmQuery: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     console.log('confirm query: ', confirmQuery);
//     try {
//       const newMessageId = Date.now() + client.id;
//       confirmQuery.context.message_id = newMessageId.toString();
//       confirmQuery.context.timestamp = Date.now();
//       confirmQuery.message.order.created_at = Date.now();
//       confirmQuery.message.order.updated_at = Date.now();

//       // forwarding the request to BAP

//       const ack = await requestForwarder(
//         confirmQuery.context.bap_uri,
//         confirmQuery,
//         this.httpService,
//       );

//       console.log('ack: ', ack);
//       client.join(confirmQuery.context.transaction_id);
//     } catch (err) {
//       client.emit('error: ', err);
//       client._error(err);
//     }
//   }
// }
