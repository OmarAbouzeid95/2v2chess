import { create } from 'zustand';
import type { Game, User } from '@/types/models';

// The only variant supported for now. Order of play: W1 → B1 → W2 → B2.
export type GameVariant = 'team-alternating';

// The four player slots, in order of play.
export type PlayerSlot = 'W1' | 'B1' | 'W2' | 'B2';

// Time control options, in minutes per team.
export const TIME_CONTROLS = [3, 5, 10, 15, 30] as const;
export type TimeControl = (typeof TIME_CONTROLS)[number];

export interface GameSettings {
	variant: GameVariant;
	// Minutes on the clock per team.
	timeControl: TimeControl;
	// Player display names keyed by slot.
	players: Record<PlayerSlot, string>;
}

interface GameState {
	// The game the client is currently in / viewing.
	currentGame: Game | null;
	// All games known to the client (e.g. a games list).
	games: Game[];
	// Settings for the game being configured before it starts.
	settings: GameSettings;

	setCurrentGame: (game: Game | null) => void;
	setGames: (games: Game[]) => void;
	upsertGame: (game: Game) => void;
	removeGame: (id: number) => void;
	// Replace the players of the current game.
	setGamePlayers: (users: User[]) => void;

	// Game settings actions.
	setVariant: (variant: GameVariant) => void;
	setTimeControl: (timeControl: TimeControl) => void;
	setPlayerName: (slot: PlayerSlot, name: string) => void;

	reset: () => void;
}

const initialState = {
	currentGame: null,
	games: [] as Game[],
	settings: {
		variant: 'team-alternating',
		timeControl: 3,
		players: {
			W1: '',
			B1: '',
			W2: '',
			B2: '',
		},
	} satisfies GameSettings,
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

	setVariant: (variant) =>
		set((state) => ({ settings: { ...state.settings, variant } })),

	setTimeControl: (timeControl) =>
		set((state) => ({ settings: { ...state.settings, timeControl } })),

	setPlayerName: (slot, name) =>
		set((state) => ({
			settings: {
				...state.settings,
				players: { ...state.settings.players, [slot]: name },
			},
		})),

	reset: () => set(initialState),
}));
