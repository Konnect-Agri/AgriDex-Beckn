import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BapController } from './bap.controller';
import { BapService } from './bap.service';
import { SearchModule } from './on-search/on-search.module';

@Module({
  imports: [SearchModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BapController],
  providers: [BapService],
})
export class BapModule { }
