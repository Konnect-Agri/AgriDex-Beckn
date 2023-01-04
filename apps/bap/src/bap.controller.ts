import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { BapService } from './bap.service';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller()
export class BapController {
  constructor(
    private readonly bapService: BapService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
    private healthCheckService: HealthCheckService,
  ) {}

  @Get()
  getHello(): string {
    return this.bapService.getHello();
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
            this.configService.get<number>('BAP_PORT') || 3010
          }/api`,
        ),
    ]);
  }
  @Post()
  async handleInitialRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    res
      .json({
        message: {
          ack: 'ACK',
        },
      })
      .status(200);

    return this.bapService.handleInitialRequest(body);
  }
}
