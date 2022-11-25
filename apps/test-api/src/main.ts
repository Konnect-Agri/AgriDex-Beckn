import { NestFactory } from '@nestjs/core';
import { TestApiModule } from './test-api.module';

async function bootstrap() {
  const app = await NestFactory.create(TestApiModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(3004);
}
bootstrap();
