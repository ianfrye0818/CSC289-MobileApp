/**
 * Re-exported customer types from the generated OpenAPI schema.
 * Import from here instead of types.generated.ts directly.
 */
import { components } from '@/types/types.generated';

export type CustomerDetails = components['schemas']['CustomerDetailsResponseDto'];
export type CustomerMemberDetails = components['schemas']['CustomerMemberDetailsResponseDto'];
export type MembershipLevel = CustomerMemberDetails['memberShipLevel'];
