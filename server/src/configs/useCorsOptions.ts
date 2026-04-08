import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Returns the CORS configuration for the NestJS application.
 *
 * **Allowed origins:** `localhost:3000` and `localhost:5173` are always
 * permitted (NestJS dev server and Vite dev server). Additional origins can be
 * injected at deploy time via the `CORS_ORIGIN` env variable (JSON array).
 *
 * **Credentials:** enabled so the browser sends cookies and `Authorization`
 * headers cross-origin during local development.
 *
 * **maxAge:** preflight responses are cached for 600 seconds (10 minutes) to
 * reduce the number of OPTIONS requests in the browser.
 *
 * Additional headers/origins can be extended at runtime via env variables
 * (`CORS_ALLOWED_HEADERS`, `CORS_EXPOSED_HEADERS`) without code changes.
 */
export const useCorsOptions = (): CorsOptions | CorsOptionsDelegate<any> => {
  return {
    origin: "*",
    // origin: [
    //   'http://localhost:3000',
    //   'http://localhost:5173',
    //   ...(process.env.CORS_ORIGIN ? JSON.parse(process.env.CORS_ORIGIN) : []),
    // ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Forwarded-Proto',
      'X-Forwarded-Host',
      'X-Forwarded-For',
      'X-API-KEY',
      ...(process.env.CORS_ALLOWED_HEADERS
        ? JSON.parse(process.env.CORS_ALLOWED_HEADERS)
        : []),
    ],
    exposedHeaders: [
      'Content-Range',
      'X-Total-Count',
      ...(process.env.CORS_EXPOSED_HEADERS
        ? JSON.parse(process.env.CORS_EXPOSED_HEADERS)
        : []),
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 600,
  };
};
