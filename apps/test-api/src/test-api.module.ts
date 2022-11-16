import { Module } from '@nestjs/common';
import { TestApiController } from './test-api.controller';
import { TestApiService } from './test-api.service';
import { SearchModule } from './search/search.module';
import { SelectModule } from './select/select.module';
import { InitModule } from './init/init.module';
import { ConfirmModule } from './confirm/confirm.module';
import { ApplicationsModule } from './applications/applications.module';
import { TrackModule } from './track/track.module';
import { ConfigModule } from '@nestjs/config';
import { UpdateModule } from './update/update.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchModule,
    SelectModule,
    InitModule,
    ConfirmModule,
    ApplicationsModule,
    TrackModule,
    UpdateModule,
  ],
  controllers: [TestApiController],
  providers: [TestApiService],
})
export class TestApiModule { }
