export const addressQueryKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressQueryKeys.all, 'list'] as const,
};
