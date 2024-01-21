import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  console.log(process.env.DATABASE_URI);
  console.log(process.env.DATABASE_USER);
  console.log(process.env.DATABASE_PASS);
  console.log(process.env.DATABASE_NAME);

  const options = new DocumentBuilder()
    .setTitle('Automation Management API')
    .setDescription('API that allows users to manage automations')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });
  await app.listen(3000);
}
bootstrap();
