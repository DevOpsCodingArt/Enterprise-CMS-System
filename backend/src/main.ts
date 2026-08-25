import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Prime One API running on: http://localhost:${port}/api/v1`);
}
bootstrap();

