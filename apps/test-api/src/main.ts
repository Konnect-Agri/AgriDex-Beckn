import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TestApiModule } from './test-api.module';

async function bootstrap() {
  const app = await NestFactory.create(TestApiModule);
  const config = new DocumentBuilder()
    .setTitle('AgriDex-Mock-Bank-Service')
    .setDescription(
      'API for the AgriDex Mock Bank Service of agridex-beckn APIs',
    )
    .setVersion('0.0')
    .addTag('agridex-mock-bank-service')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.TEST_API || 3004);
}
bootstrap();
