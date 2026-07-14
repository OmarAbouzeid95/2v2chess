import { create } from 'zustand';
import type { User } from '@/types/models';

// Client-owned session state only. Lists of users are server state and are
// fetched via TanStack Query (see src/api/users.ts), not held here.
interface UserState {
	// The signed-in / active user.
	currentUser: User | null;
	// Access token for authenticated requests. Kept in memory (not persisted)
	// and read by the axios interceptor in src/lib/api.ts.
	accessToken: string | null;

	setCurrentUser: (user: User | null) => void;
	setAccessToken: (token: string | null) => void;
	reset: () => void;
}

const initialState = {
	currentUser: null,
	accessToken: null,
};

export const useUserStore = create<UserState>((set) => ({
	...initialState,

	setCurrentUser: (currentUser) => set({ currentUser }),

	setAccessToken: (accessToken) => set({ accessToken }),

	reset: () => set(initialState),
}));
