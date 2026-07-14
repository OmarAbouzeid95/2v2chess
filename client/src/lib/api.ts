import axios, {
	AxiosError,
	type InternalAxiosRequestConfig,
} from 'axios';

import { useUserStore } from '@/stores/userStore';

// Single axios instance for the whole app. `withCredentials` is required so the
// httpOnly refreshToken cookie is sent to /auth/refresh-token.
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
	withCredentials: true,
});

// Attach the in-memory access token to every request. We read the store via
// getState() because interceptors run outside of React.
api.interceptors.request.use((config) => {
	const token = useUserStore.getState().accessToken;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Allow us to flag a request that has already been retried after a refresh.
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const REFRESH_URL = '/auth/refresh-token';

// On a 401, try to refresh the access token once (using the refresh cookie) and
// replay the original request. If refresh fails, clear the session.
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const original = error.config as RetriableConfig | undefined;

		const isAuthCall = original?.url?.includes('/auth/');
		if (
			error.response?.status !== 401 ||
			!original ||
			original._retry ||
			isAuthCall
		) {
			return Promise.reject(error);
		}

		original._retry = true;

		try {
			const { data } = await api.post<{ accessToken: string }>(
				REFRESH_URL,
			);
			useUserStore.getState().setAccessToken(data.accessToken);
			original.headers.Authorization = `Bearer ${data.accessToken}`;
			return api(original);
		} catch (refreshError) {
			useUserStore.getState().reset();
			return Promise.reject(refreshError);
		}
	},
);
