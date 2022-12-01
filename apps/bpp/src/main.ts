import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BppModule } from './bpp.module';

async function bootstrap() {
  const app = await NestFactory.create(BppModule);
  const config = new DocumentBuilder()
    .setTitle('AgriDex-Beckn-BPP')
    .setDescription('API for the BPP service of agridex-beckn APIs')
    .setVersion('0.0')
    .addTag('agridex-beckn-bpp')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.BPP_PORT || 3002);
}
bootstrap();
