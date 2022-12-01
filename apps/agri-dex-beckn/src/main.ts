import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis-socketio.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter(new WsAdapter(app) as any);

  app.useWebSocketAdapter(redisIoAdapter);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const config = new DocumentBuilder()
    .setTitle('AgriDex-Beckn-Client-Proxy')
    .setDescription('API for the client proxy service of agridex-beckn APIs')
    .setVersion('0.0')
    .addTag('agridex-beckn-proxy')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.AGRI_DEX_BECKN_PORT || 3003);
}
bootstrap();
