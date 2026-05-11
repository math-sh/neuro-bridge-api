import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './ioC/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
  });
  const config = app.get(ConfigService);
  app.enableCors({
    origin: config.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true,
      whitelist: true, // Automatically remove non-decorated properties
    }),
  );

  const docConfig = new DocumentBuilder()
    .setTitle('Api neurobridge')
    .setDescription(
      'API escrita em para o projeto neurobridge que visa ajudar crianças e pais atipicos.',
    )
    .setVersion('1.0.0')
    .setContact('Equipe de Desenvolvimento', '', 'math-sh')
    .setLicense('UNLICENSED', '')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API Neurobridge - Documentação',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const api = await app.listen(config.get<string>('APP_PORT') ?? 8080);
  Logger.debug(
    `API is running on port ${config.get<string>('APP_PORT') ?? 8080}.`,
    'Bootstrap',
  );
}
bootstrap();
