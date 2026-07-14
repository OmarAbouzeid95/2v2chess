import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { User } from '@/types/models';
import { queryKeys } from './queryKeys';

// Payload for POST /users (create/signup).
export interface CreateUserInput {
	name: string;
}

// GET /users — all users.
export function useUsers() {
	return useQuery({
		queryKey: queryKeys.users.all,
		queryFn: async () => {
			const { data } = await api.get<User[]>('/users');
			return data;
		},
	});
}

// GET /users/:id — a single user.
export function useUser(id: number | undefined) {
	return useQuery({
		queryKey: id ? queryKeys.users.detail(id) : queryKeys.users.all,
		queryFn: async () => {
			const { data } = await api.get<User>(`/users/${id}`);
			return data;
		},
		enabled: id != null,
	});
}

// POST /users — create a user, then refresh the users list.
export function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: CreateUserInput) => {
			const { data } = await api.post<User>('/users', input);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
		},
	});
}
