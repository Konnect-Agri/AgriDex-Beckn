import { Body, Controller, Post, Res } from '@nestjs/common';
import { InitService } from './init.service';

@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) { }

  @Post()
  async handleInit(@Body() body: any, @Res() res: Response,) {
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };
    //@ts-ignore
    res.json(ack).status(200);
    this.initService.handleInit(body);
  }
}
