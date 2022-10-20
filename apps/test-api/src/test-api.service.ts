import { Injectable } from '@nestjs/common';

@Injectable()
export class TestApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
