import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Get()
  getAllApplications() {
    return this.applicationsService.getAllApplications();
  }

  @Get(':id')
  getApplicationForm(@Param('id') order_id: string) {
    return this.applicationsService.getApplicationForm(order_id);
  }

  @Post('review/:id')
  handleReview(
    @Param('id') order_id: string,
    @Headers('host') host: string,
    @Body() body: any,
  ) {
    return this.applicationsService.handleReview(body, host, order_id);
  }
}
