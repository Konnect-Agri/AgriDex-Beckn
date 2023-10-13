import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BppModule } from './bpp.module';
import * as Sentry from '@sentry/node';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(BppModule);
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  Sentry.init({
    dsn: "https://11b27c6c778d42a396527d42a0ea5428@bugs.samagra.io/6",
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
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
