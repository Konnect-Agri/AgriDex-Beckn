import { Module } from '@nestjs/common';
import { BgController } from './bg.controller';
import { BgService } from './bg.service';
import { SearchModule } from './search/search.module';
import { OnSearchModule } from './on_search/on_search.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SearchModule,
    OnSearchModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BgController],
  providers: [BgService],
})
export class BgModule { }
