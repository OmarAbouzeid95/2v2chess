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

// Client-owned state only. Lists of games are server state and are fetched via
// TanStack Query (see src/api/games.ts), not held here.
interface GameState {
	// The game the client is currently in / viewing.
	currentGame: Game | null;
	// Settings for the game being configured before it starts.
	settings: GameSettings;

	setCurrentGame: (game: Game | null) => void;
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
