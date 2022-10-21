import { NestFactory } from '@nestjs/core';
import { BapModule } from './bap.module';

async function bootstrap() {
  const app = await NestFactory.create(BapModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'POST',
  });
  await app.listen(3000);
}
bootstrap();
