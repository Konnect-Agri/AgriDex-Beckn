import { Module } from '@nestjs/common';
import { SearchService } from './on-search.service';
import { SearchController } from './on-search.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
