import { NestFactory } from '@nestjs/core';
import { BppModule } from './bpp.module';

async function bootstrap() {
  const app = await NestFactory.create(BppModule);
  await app.listen(3000);
}
bootstrap();
