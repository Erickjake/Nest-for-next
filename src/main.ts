import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { parseCorsWhitelist } from './common/utils/parse-cors-whitelist';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ==========================================
  // 1. PRIMEIRO: Imagens Públicas
  // Colocamos as imagens ANTES do Helmet.
  // Assim, quem pedir uma imagem recebe-a logo, sem passar pela segurança estrita.
  // ==========================================
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    setHeaders: (res: Response) => {
      // Garantimos que qualquer site pode ler estas imagens
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });

  // ==========================================
  // 2. SEGUNDO: O Guarda-costas (Helmet)
  // Agora o Helmet só vai inspecionar os pedidos que vão para a tua API (ex: /posts, /users)
  // ==========================================
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'blob:'], // Permitimos imagens locais e blobs
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
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
      return callback(new Error('Origin not allowed by CORS'));
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
