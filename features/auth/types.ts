import { components } from '@/types/types.generated';

/**
 * The authenticated user's profile data as returned by the server's auth endpoints.
 *
 * This is a convenience alias for the generated `AuthUserDto` schema type so the
 * rest of the app can import a short name instead of the verbose generated path.
 *
 * The underlying type is auto-generated from the OpenAPI schema — do NOT edit it
 * here. If the server's `AuthUserDto` changes, regenerate `types.generated.ts`
 * and this alias will pick up the new shape automatically.
 */
export type AppUser = components['schemas']['AuthUserDto'];
