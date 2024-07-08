import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as dotenv from 'dotenv';

const PORT = 8000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const expressApp = express();
  dotenv.config();
  expressApp.use('/public', express.static('public'));
  app.use(expressApp);


  await app.listen(PORT, () => {
    console.log(`Server listening successfully in Port ${PORT} `)
  });
}

bootstrap();
