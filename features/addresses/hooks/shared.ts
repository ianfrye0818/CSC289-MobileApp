export const addressQueryKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressQueryKeys.all, 'list'] as const,
  details: (addressId: number) => [...addressQueryKeys.all, 'detail', addressId] as const,
};
