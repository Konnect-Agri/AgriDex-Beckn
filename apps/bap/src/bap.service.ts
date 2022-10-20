import { Injectable } from '@nestjs/common';

@Injectable()
export class BapService {
  getHello(): string {
    return 'Hello World from AgriDex BAP!';
  }
}
