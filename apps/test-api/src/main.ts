import { NestFactory } from '@nestjs/core';
import { TestApiModule } from './test-api.module';

async function bootstrap() {
  const app = await NestFactory.create(TestApiModule);
  await app.listen(3000);
}
bootstrap();
