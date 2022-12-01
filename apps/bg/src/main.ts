import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BgModule } from './bg.module';

async function bootstrap() {
  const app = await NestFactory.create(BgModule);
  const config = new DocumentBuilder()
    .setTitle('AgriDex-Beckn-BG')
    .setDescription('API for the BG service of agridex-beckn APIs')
    .setVersion('0.0')
    .addTag('agridex-beckn-bg')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.BG_PORT || 3001);
}
bootstrap();
