import { NestFactory } from '@nestjs/core';
import { BgModule } from './bg.module';

async function bootstrap() {
  const app = await NestFactory.create(BgModule);
  await app.listen(3000);
}
bootstrap();
