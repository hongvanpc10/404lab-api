import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://404lab.site'],
  });

  app.use(cookieParser());

  await app.listen(PORT, () => {
    console.log(`>>> Server is running on port ${PORT}`);
  });
}
bootstrap();
