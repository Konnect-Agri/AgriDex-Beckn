import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SearchDTO } from './dto/on-search.dto';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly socketClient: Socket;
  constructor(private readonly httpService: HttpService) {
    this.socketClient = io(process.env.WEBSOCKET_ADAPTER_URL);
  }

  onModuleInit() {
    this.handleSearchMessage();
  }

  private async handleSearchMessage() {
    // emitting a BAP connection event on connection
    this.socketClient.on('connect', () => {
      this.socketClient.emit('bapConnection', 'hello from bap');
    });

    this.socketClient.on('search', async (searchReq: SearchDTO) => {
      console.log('inside BAP search');
      try {
        const requestOptions = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const requestBody = {
          context: searchReq.context,
          message: {
            intent: {
              tags: {
                block:
                  searchReq.message.catalogue.providers[0].locations[0]
                    .descriptor.name,
                district:
                  searchReq.message.catalogue.providers[0].locations[1]
                    .descriptor.name,
                bank_name: searchReq.message.catalogue.providers[0].id,
              },
            },
          },
        };

        // forward this request to BG to forward to BPP
        await lastValueFrom(
          this.httpService.post(
            'http://localhost:3001/search',
            requestBody,
            requestOptions,
          ),
        );

        // console.log('fwded');
      } catch (err) {
        console.log('err: ', err);
        throw new InternalServerErrorException();
      }
    });
  }

  async handleSearch(searchResponse: SearchDTO) {
    // this is the REST endpoint where the BAP callback will provide the result
    console.log('in BAP handle search rest fn');
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };
    try {
      // TODO: response content verification before responding with ACK and forwarding

      // forwarding request to proxy
      this.socketClient.emit('searchResponse', searchResponse);

      //sending acknowledgement to BPP
      return ack;
    } catch (err) {
      console.error('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
