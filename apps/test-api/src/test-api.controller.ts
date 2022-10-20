import { Controller, Get } from '@nestjs/common';
import { TestApiService } from './test-api.service';

@Controller()
export class TestApiController {
  constructor(private readonly testApiService: TestApiService) {}

  @Get()
  getHello(): string {
    return this.testApiService.getHello();
  }
}
