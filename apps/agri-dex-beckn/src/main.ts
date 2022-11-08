import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis-socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter(new WsAdapter(app) as any);

  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3003);
}
bootstrap();
