import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class InitService {
  constructor(private readonly httpService: HttpService) { }
  async handleInitRequest(body: any) {
    try {
      console.log('body in init service of test-api: ', body);
      return { status: 'ok' };
    } catch (err) {
      console.log('error in init service of test-api: ', err);
      throw new InternalServerErrorException(err);
    }
  }
}
