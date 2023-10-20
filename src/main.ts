import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'; // Importa el módulo cors

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })


  )
  // Habilitar el middleware CORS
  app.use(cors());

  await app.listen(3000);
}
bootstrap();
