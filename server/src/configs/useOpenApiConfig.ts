import { ConfigService } from '@/services/ConfigService/Config.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  INestApplication,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures Swagger/OpenAPI documentation for the application.
 *
 * The Swagger UI and JSON spec are only mounted in `development` mode so that
 * internal API details are not exposed in production.
 *
 * **Endpoints (dev only):**
 * - `GET /api/swagger` — interactive Swagger UI
 * - `GET /api/swagger/json` — raw OpenAPI JSON (used to generate the mobile
 *   app's `types.generated.ts` via `openapi-typescript`)
 *
 * **Global responses:** Common HTTP error codes (400, 401, 403, 404, 409, 500)
 * are added to every endpoint's Swagger documentation automatically.
 */
export const useOpenApiConfig = (
  configService: ConfigService,
  app: INestApplication,
) => {
  const isDev = configService.get('NODE_ENV') === 'development';
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CSC Capstone API')
    .setDescription('CSC Capstone API Documentation')
    .setVersion(process.env.VERSION ?? '1.0.0')
    .addGlobalResponse({
      type: BadRequestException,
      status: HttpStatus.BAD_REQUEST,
    })
    .addGlobalResponse({
      type: UnauthorizedException,
      status: HttpStatus.UNAUTHORIZED,
    })
    .addGlobalResponse({
      type: ForbiddenException,
      status: HttpStatus.FORBIDDEN,
    })
    .addGlobalResponse({
      type: NotFoundException,
      status: HttpStatus.NOT_FOUND,
    })
    .addGlobalResponse({
      type: ConflictException,
      status: HttpStatus.CONFLICT,
    })
    .addGlobalResponse({
      type: InternalServerErrorException,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);

  if (isDev) {
    SwaggerModule.setup('/api/swagger', app, documentFactory, {
      jsonDocumentUrl: '/api/swagger/json',
    });
  }
};
