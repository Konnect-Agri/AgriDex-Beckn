import { Controller, Get } from '@nestjs/common';
import { BgService } from './bg.service';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller()
export class BgController {
  constructor(
    private readonly bgService: BgService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
    private healthCheckService: HealthCheckService,
  ) {}

  @Get()
  getHello(): string {
    return this.bgService.getHello();
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
            this.configService.get<number>('BG_PORT') || 3001
          }/api`,
        ),
    ]);
  }
}
