import { create } from 'zustand';
import type { User } from '@/types/models';

interface UserState {
	// The signed-in / active user.
	currentUser: User | null;
	// All users known to the client (e.g. players in a lobby).
	users: User[];

	setCurrentUser: (user: User | null) => void;
	setUsers: (users: User[]) => void;
	upsertUser: (user: User) => void;
	removeUser: (id: number) => void;
	reset: () => void;
}

const initialState = {
	currentUser: null,
	users: [] as User[],
};

export const useUserStore = create<UserState>((set) => ({
	...initialState,

	setCurrentUser: (currentUser) => set({ currentUser }),

	setUsers: (users) => set({ users }),

	upsertUser: (user) =>
		set((state) => {
			const exists = state.users.some((u) => u.id === user.id);
			return {
				users: exists
					? state.users.map((u) => (u.id === user.id ? user : u))
					: [...state.users, user],
				currentUser:
					state.currentUser?.id === user.id ? user : state.currentUser,
			};
		}),

	removeUser: (id) =>
		set((state) => ({
			users: state.users.filter((u) => u.id !== id),
			currentUser:
				state.currentUser?.id === id ? null : state.currentUser,
		})),

	reset: () => set(initialState),
}));
