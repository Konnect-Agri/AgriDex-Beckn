import { Injectable } from '@nestjs/common';

@Injectable()
export class BppService {
  getHello(): string {
    return 'Hello World from AgriDex BPP!';
  }
}
