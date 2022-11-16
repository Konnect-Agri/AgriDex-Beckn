import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
// import { SearchGateway } from './search.gateway';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [HttpModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule { }
