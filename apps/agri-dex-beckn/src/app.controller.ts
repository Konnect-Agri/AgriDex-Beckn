import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AppGateway } from './app.gateway';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetOrderByClientIDResponse,
  GetOrderByClientIdDTO,
} from './dto/GetOrdersByClientId.dto';
import { Ack } from 'utils/types/ack';
import { GenericBecknRequestBody } from 'utils/types/generic';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appGateway: AppGateway,
  ) {}

  @ApiOperation({
    summary: 'Returns Hello World when the server is up',
  })
  @ApiResponse({ type: String })
  @HttpCode(200)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({
    summary: 'Returns Orders by Client ID',
  })
  @ApiBody({ type: GetOrderByClientIdDTO })
  @ApiResponse({ type: GetOrderByClientIDResponse })
  @HttpCode(200)
  @Post('orders')
  getUserOrders(@Body() body: GetOrderByClientIdDTO) {
    return this.appService.getUserOrders(body);
  }

  // THIS ROUTE IS USED INTERNALLY AND SHOULD BE CALLED ONLY BY THE BAP
  // TODO: ADD TOKEN BASED AUTHENTICATION
  // @ApiOperation({
  //   summary: 'Handles a response from the BAP',
  // })
  // @ApiBody({ type: GenericBecknRequestBody })
  // @ApiResponse({ type: Ack })
  // @HttpCode(200)
  @Post()
  async handleResponse(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const ack = {
      message: {
        ack: {
          status: 'ACK',
        },
      },
    };

    res.json(ack).status(200);
    console.log('final response in seach controller in proxy: ', body);
    this.appGateway.handleResponse(body);
  }
}
