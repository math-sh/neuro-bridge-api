import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
  });
  app.enableCors({
    origin: process.env.FRONTEND_URL,
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

  const api = await app.listen(process.env.APP_PORT ?? 3000);
  Logger.debug(`API is running on port ${api.address().port}`, 'Bootstrap');
}
bootstrap();
