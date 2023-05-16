import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OnSelectService } from './on-select.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Ack } from 'utils/types/ack';

@Controller('on_select')
export class OnSelectController {
  constructor(private readonly onSelectService: OnSelectService) {}
  @ApiOperation({
    summary: 'Listen to the response of async search request from the BPP',
  })
  @ApiResponse({
    type: Ack,
    status: 200,
    description: 'Acknowledgement to BPP',
  })
  // @ApiBody({ type: any })
  @HttpCode(200)
  @Post()
  async handleOnSelect(
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

    this.onSelectService.handleSelectResponse(body);
  }
}
