import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BppController } from './bpp.controller';
import { BppService } from './bpp.service';
import { OnSearchModule } from './search/search.module';

@Module({
  imports: [
    OnSearchModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BppController],
  providers: [BppService],
})
export class BppModule { }
