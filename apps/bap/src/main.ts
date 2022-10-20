import { NestFactory } from '@nestjs/core';
import { BapModule } from './bap.module';

async function bootstrap() {
  const app = await NestFactory.create(BapModule);
  await app.listen(3000);
}
bootstrap();
