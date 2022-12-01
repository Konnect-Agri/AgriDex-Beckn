import { NestFactory } from '@nestjs/core';
import { BppModule } from './bpp.module';

async function bootstrap() {
  const app = await NestFactory.create(BppModule);
  await app.listen(process.env.BPP_PORT || 3002);
}
bootstrap();
