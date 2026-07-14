import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Treat data as fresh for 30s before refetching.
			staleTime: 30_000,
			retry: 1,
		},
	},
});
