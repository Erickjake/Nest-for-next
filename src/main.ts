import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { parseCorsWhitelist } from './common/utils/parse-cors-whitelist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Use Helmet para configurar os headers de segurança
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );

  // Use ValidationPipe global para validar os DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const corsWhitelist = parseCorsWhitelist(process.env.CORS_WHITELIST ?? '');
  // Ative CORS para permitir que o frontend acesse a API
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (...args: any[]) => void,
    ) => {
      if (!origin || corsWhitelist.includes(origin)) {
        return callback(null, true);
      }
      // Se a origem não estiver na whitelist, rejeite a solicitação
      return callback(new Error('Origin not allowed by CORS'));
    },
  });
  // Inicie o servidor na porta definida em .env ou 3000 por padrão
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
