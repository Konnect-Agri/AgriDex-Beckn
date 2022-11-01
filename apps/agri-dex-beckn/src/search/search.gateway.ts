import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SearchGateway {
  @WebSocketServer() server: Server;
  @SubscribeMessage('search')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    console.log('body: ', body);
    // console.log('client: ', client);
    this.server
      .to('searchClientRoom')
      .emit('search', 'hello from the room emitter');
    return 'hello from search gateway';
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log('handle connection called');
    // console.log('client: ', client);
    console.log(client.rooms);
    client.join('searchClientRoom');
  }
}
