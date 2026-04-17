import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useCorsOptions } from './configs/useCorsOptions';
import { useGlobalFilters } from './configs/useCreateGlobalFilters';
import { useOpenApiConfig } from './configs/useOpenApiConfig';
import { useValidationPipes } from './configs/useValidationPipes';
import { ConfigService } from './services/ConfigService/Config.service';

/**
 * Application entry point — bootstraps the NestJS server.
 *
 * Startup order:
 * 1. Create the NestJS app from `AppModule`.
 * 2. Read config from `ConfigService` (Zod-validated env vars).
 * 3. Register global interceptors, CORS, validation pipes, Swagger, and
 *    exception filters — each delegated to a focused setup helper in `configs/`.
 * 4. Set the global route prefix to `api` so all endpoints live under `/api/...`.
 * 5. Start listening on the configured `PORT`.
 *
 * All global middleware is applied here (not inside individual modules) so the
 * startup sequence is easy to audit in one place.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.use((req, res, next) => {
    console.log('req.url', req.url);
    console.log('req.headers', req.headers);
    next();
  });
  app.enableCors(useCorsOptions());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(useValidationPipes());
  useOpenApiConfig(configService, app);
  useGlobalFilters(app);
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API URL: ${configService.get('API_URL')}`);
    console.log(`Swagger URL: ${configService.get('API_URL')}/api/swagger`);
  });
}
bootstrap();
