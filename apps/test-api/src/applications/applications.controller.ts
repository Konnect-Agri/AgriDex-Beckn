import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoanApplication } from '../../../../utils/types/hasura/loanApplicaton';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({
    summary: 'Gets all applications back',
  })
  @ApiResponse({ type: LoanApplication })
  @HttpCode(200)
  @Get()
  getAllApplications() {
    return this.applicationsService.getAllApplications();
  }

  @ApiOperation({
    summary: 'Get applications form by order id',
  })
  @ApiResponse({ type: String })
  @HttpCode(200)
  @Get(':id')
  getApplicationForm(@Param('id') order_id: string) {
    return this.applicationsService.getApplicationForm(order_id);
  }

  @ApiOperation({
    summary: 'Review an application as a bank manager',
  })
  @ApiBody({ type: String })
  @ApiResponse({ type: String })
  @HttpCode(200)
  @Post('review/:id')
  handleReview(
    @Param('id') order_id: string,
    @Headers('host') host: string,
    @Body() body: any,
  ) {
    return this.applicationsService.handleReview(body, host, order_id);
  }
}
