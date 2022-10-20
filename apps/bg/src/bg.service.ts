import { Injectable } from '@nestjs/common';

@Injectable()
export class BgService {
  getHello(): string {
    return 'Hello World AgriDex BG!';
  }
}
