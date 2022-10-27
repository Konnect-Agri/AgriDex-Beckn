import { Module } from '@nestjs/common';
import { OnSearchService } from './search.service';
import { OnSearchController } from './search.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OnSearchController],
  providers: [OnSearchService],
})
export class OnSearchModule { }
