import { ValueOf } from '@/types/ValueOf';

export const MembershipLevel = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;

export type MembershipLevel = ValueOf<typeof MembershipLevel>;
