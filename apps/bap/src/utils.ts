import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

const requestForwarder = async (
  url: string,
  reqData: any,
  httpService: HttpService,
) => {
  try {
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return await lastValueFrom(httpService.post(url, reqData, requestOptions));
  } catch (err) {
    console.log('err: ', err);
    return new InternalServerErrorException();
  }
};

export { requestForwarder };
