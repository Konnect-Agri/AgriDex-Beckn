import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { SelectModule } from './select/select.module';
import { InitModule } from './init/init.module';
import { ConfirmService } from './confirm/confirm.service';
import { ConfirmModule } from './confirm/confirm.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AppGateway } from './app.gateway';
import { SearchService } from './search/search.service';
import { InitService } from './init/init.service';
import { SelectService } from './select/select.service';
import { ConfigModule } from '@nestjs/config';
import { UpdateModule } from './update/update.module';
import { TrackModule } from './track/track.module';
import { TrackService } from './track/track.service';
import { UpdateService } from './update/update.service';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    SearchModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SelectModule,
    InitModule,
    ConfirmModule,
    HttpModule,
    UpdateModule,
    TrackModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    ConfirmService,
    SearchService,
    InitService,
    SelectService,
    TrackService,
    UpdateService,
  ],
})
export class AppModule { }
