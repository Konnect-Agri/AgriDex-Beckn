import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SearchGateway } from './search.gateway';

@Module({
  imports: [HttpModule],
  providers: [SearchGateway],
})
export class SearchModule { }
