import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Cookie parser middleware
  app.use(cookieParser());

  // Global prefix for API routes (exclude docs)
  app.setGlobalPrefix('api', {
    exclude: ['docs', 'docs/(.*)'],
  });

  // Swagger documentation
  setupSwagger(app);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Application docs on: http://localhost:${port}/docs`);
}
bootstrap();
