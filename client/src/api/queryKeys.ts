// Centralized TanStack Query keys so list/detail invalidation stays consistent.
export const queryKeys = {
	users: {
		all: ['users'] as const,
		detail: (id: number) => ['users', id] as const,
	},
	games: {
		all: ['games'] as const,
		detail: (id: number) => ['games', id] as const,
	},
};
