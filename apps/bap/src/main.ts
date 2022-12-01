import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BapModule } from './bap.module';

async function bootstrap() {
  const app = await NestFactory.create(BapModule);
  const config = new DocumentBuilder()
    .setTitle('AgriDex-Beckn-BAP')
    .setDescription('API for the BAP service of agridex-beckn APIs')
    .setVersion('1.0')
    .addTag('agridex-beckn-bap')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'POST',
  });
  await app.listen(process.env.BAP_PORT || 3000);
}
bootstrap();
