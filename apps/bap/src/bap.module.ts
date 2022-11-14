import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BapController } from './bap.controller';
import { BapService } from './bap.service';
import { SearchModule } from './on-search/on-search.module';
import { OnSelectModule } from './on-select/on-select.module';
import { OnInitModule } from './on-init/on-init.module';
import { OnConfirmModule } from './on-confirm/on-confirm.module';
import { HttpModule } from '@nestjs/axios';
import { OnUpdateModule } from './on-update/on-update.module';
import { OnTrackModule } from './on-track/on-track.module';

@Module({
  imports: [
    SearchModule,
    ConfigModule.forRoot({ isGlobal: true }),
    OnSelectModule,
    OnInitModule,
    OnConfirmModule,
    HttpModule,
    OnUpdateModule,
    OnTrackModule,
  ],
  controllers: [BapController],
  providers: [BapService],
})
export class BapModule { }
