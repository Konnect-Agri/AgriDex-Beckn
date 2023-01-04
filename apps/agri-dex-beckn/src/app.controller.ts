import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AppGateway } from './app.gateway';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appGateway: AppGateway,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
    private healthCheckService: HealthCheckService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/health')
  @HealthCheck()
  @ApiOperation({ summary: 'Get Health Check Status' })
  @ApiResponse({
    status: 200,
    description: 'Result Report for All the Health Check Services',
  })
  async checkHealth() {
    return this.healthCheckService.check([
      async () =>
        this.http.pingCheck(
          'Basic Check',
          `http://localhost:${
            this.configService.get<number>('AGRI_DEX_BECKN_PORT') || 3003
          }/api`,
        ),
    ]);
  }

  @Post('orders')
  getUserOrders(@Body() body: any) {
    return this.appService.getUserOrders(body);
  }

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
