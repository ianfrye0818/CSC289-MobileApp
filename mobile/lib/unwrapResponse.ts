import { ApiError } from './apierror';

/**
 * Unwraps an API response from openapi-fetch client.
 * Throws an ApiError if the response has an error, otherwise returns the data.
 *
 * @param response - The response object from openapi-fetch with `data` and `error` properties
 * @param errorMessage - Optional custom error message if the response has an error
 * @returns The data from the response, typed as T
 * @throws ApiError if the response has an error
 */
export function unwrapResponse<T>(
  response: {
    data?: T | null | undefined;
    error?: { message?: string | string[]; [key: string]: unknown } | null | undefined;
    response?: Response;
  },
  errorMessage?: string,
): T {
  // Helper function to extract error message from various error formats
  const extractErrorMessage = (error: unknown): string | undefined => {
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      // Check for nested error objects (common in some error formats)
      if ('error' in error && typeof error.error === 'object' && error.error !== null) {
        const nestedError = error.error as { message?: string };
        if (typeof nestedError.message === 'string') {
          return nestedError.message;
        }
      }
      // Check for message property
      if ('message' in error) {
        if (typeof error.message === 'string') {
          return error.message;
        }
        if (Array.isArray(error.message) && error.message.length > 0) {
          return error.message.join(', ');
        }
      }
      // Check for error property that might be a string
      if ('error' in error && typeof error.error === 'string') {
        return error.error;
      }
    }
    return undefined;
  };

  // Check for error in response.error first (parsed by openapi-fetch)
  if (response.error != null) {
    const extractedMessage = extractErrorMessage(response.error);
    const message =
      errorMessage || extractedMessage || 'An error occurred while processing the request';

    console.error('API Error:', response.error);
    throw new ApiError({
      message,
      statusCode: response.response?.status,
      originalError: response.error,
      orginalPath: response.response?.url || undefined,
    });
  }

  // If response is not ok but error wasn't parsed, fall back to statusText
  if (!response.response?.ok) {
    console.error(
      'Response not ok. Status:',
      response.response?.status,
      'StatusText:',
      response.response?.statusText,
    );
    throw new ApiError({
      message:
        errorMessage ||
        response.response?.statusText ||
        'An error occurred while processing the request',
      statusCode: response.response?.status,
      originalError: response.response,
      orginalPath: response.response?.url || undefined,
    });
  }

  return response.data as T;
}
