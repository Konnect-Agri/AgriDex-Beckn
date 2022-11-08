import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { requestForwarder } from './utils';

@Injectable()
export class BapService {
  constructor(private readonly httpService: HttpService) { }

  getHello(): string {
    return 'Hello World from AgriDex BAP!';
  }
  // TODO: add types for body
  async handleInitialRequest(body: any, host: string) {
    const action = body.context.action;
    // TODO: add a request validator
    switch (action) {
      case 'search':
        // forward to BG
        // body.context.bap_id = '101';
        // body.context.bap_uri = `http://${host}`;
        return await requestForwarder(
          process.env.BG_SEARCH_URL,
          body,
          this.httpService,
        );
        break;
      case 'select':
        if (!body.context.bpp_uri) {
          throw new Error('Invalid Context: bpp_uri is missing');
        }

        // forward to BPP
        return await requestForwarder(
          body.context.bpp_uri + '/select',
          body,
          this.httpService,
        );

        break;
      case 'init':
        if (!body.context.bpp_uri) {
          throw new Error('Invalid Context: bpp_uri is missing');
        }

        // forward to BPP
        return await requestForwarder(
          body.context.bpp_uri + '/init',
          body,
          this.httpService,
        );
        break;
      case 'confirm':
        if (!body.context.bpp_uri) {
          throw new Error('Invalid Context: bpp_uri is missing');
        }

        // forward to BPP
        return await requestForwarder(
          body.context.bpp_uri + '/confirm',
          body,
          this.httpService,
        );
        break;
      default:
        throw new Error('Invalid action');
    }
  }
}
