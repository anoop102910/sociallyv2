import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './middleware/logger.middleware';
import * as compression from 'compression';
import { AllExceptionsFilter } from './lib/exception-fitler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.CLIENT_URL)
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
  });
  app.use(logger);
  app.use(compression());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
