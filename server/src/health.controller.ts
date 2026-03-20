import { Controller, Get } from '@nestjs/common';

/**
 * Simple health-check controller.
 *
 * `GET /api/health` returns `{ status: 'ok' }` when the server is running.
 * Useful for load balancers, Docker health checks, and uptime monitors to
 * verify the process is alive without requiring authentication.
 */
@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
