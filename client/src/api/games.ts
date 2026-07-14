import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Game } from '@/types/models';
import { queryKeys } from './queryKeys';

// Payload for POST /games. User ids of the four players.
export interface CreateGameInput {
	userIds: number[];
}

// GET /games — all games (each includes its users[]).
export function useGames() {
	return useQuery({
		queryKey: queryKeys.games.all,
		queryFn: async () => {
			const { data } = await api.get<Game[]>('/games');
			return data;
		},
	});
}

// GET /games/:id — a single game.
export function useGame(id: number | undefined) {
	return useQuery({
		queryKey: id ? queryKeys.games.detail(id) : queryKeys.games.all,
		queryFn: async () => {
			const { data } = await api.get<Game>(`/games/${id}`);
			return data;
		},
		enabled: id != null,
	});
}

// POST /games — create a game, then refresh the games list.
export function useCreateGame() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: CreateGameInput) => {
			const { data } = await api.post<Game>('/games', input);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.games.all });
		},
	});
}
