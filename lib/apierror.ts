export class ApiError extends Error {
  orginalPath?: string;
  statusCode?: number;
  originalError?: unknown;
  constructor(partial: Partial<ApiError>) {
    super(partial.message || 'An unknown error occurred');
    this.name = 'ApiError';
    this.statusCode = partial.statusCode;
    this.originalError = partial.originalError;
    this.orginalPath = partial.orginalPath;
  }
}
