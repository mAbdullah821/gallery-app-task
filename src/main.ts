import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  //................................................................................................................................
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  //.......................................................................................................................................
  app.enableCors();
  //.......................................................................................................................................
  const docsUser = process.env.DOCS_USER as string;
  const docsPass = process.env.DOCS_PASS as string;

  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: { [docsUser]: docsPass },
    }),
  );
  //.......................................................................................................................................
  const config = new DocumentBuilder()
    .setTitle('Gallery App')
    .setDescription('Gallery App API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Node Environment: ', process.env.NODE_ENV);
  console.log('Server running on port: ', process.env.PORT);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
