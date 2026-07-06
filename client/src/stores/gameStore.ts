import { create } from 'zustand';
import type { Game, User } from '@/types/models';

interface GameState {
	// The game the client is currently in / viewing.
	currentGame: Game | null;
	// All games known to the client (e.g. a games list).
	games: Game[];

	setCurrentGame: (game: Game | null) => void;
	setGames: (games: Game[]) => void;
	upsertGame: (game: Game) => void;
	removeGame: (id: number) => void;
	// Replace the players of the current game.
	setGamePlayers: (users: User[]) => void;
	reset: () => void;
}

const initialState = {
	currentGame: null,
	games: [] as Game[],
};

export const useGameStore = create<GameState>((set) => ({
	...initialState,

	setCurrentGame: (currentGame) => set({ currentGame }),

	setGames: (games) => set({ games }),

	upsertGame: (game) =>
		set((state) => {
			const exists = state.games.some((g) => g.id === game.id);
			return {
				games: exists
					? state.games.map((g) => (g.id === game.id ? game : g))
					: [...state.games, game],
				currentGame:
					state.currentGame?.id === game.id ? game : state.currentGame,
			};
		}),

	removeGame: (id) =>
		set((state) => ({
			games: state.games.filter((g) => g.id !== id),
			currentGame:
				state.currentGame?.id === id ? null : state.currentGame,
		})),

	setGamePlayers: (users) =>
		set((state) =>
			state.currentGame
				? { currentGame: { ...state.currentGame, users } }
				: state,
		),

	reset: () => set(initialState),
}));
