import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BppController } from './bpp.controller';
import { BppService } from './bpp.service';
import { OnSearchModule } from './search/search.module';
import { SelectModule } from './select/select.module';
import { InitModule } from './init/init.module';
import { ConfirmModule } from './confirm/confirm.module';
import { UpdateModule } from './update/update.module';
import { TrackModule } from './track/track.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    OnSearchModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SelectModule,
    InitModule,
    ConfirmModule,
    UpdateModule,
    TrackModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [BppController],
  providers: [BppService],
})
export class BppModule {}
