import { Module } from '@nestjs/common';
import { OnUpdateService } from './on-update.service';
import { OnUpdateController } from './on-update.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OnUpdateService],
  controllers: [OnUpdateController]
})
export class OnUpdateModule { }
