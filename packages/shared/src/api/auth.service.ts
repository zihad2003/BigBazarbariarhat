import { fetchHandler } from './client';
import { ApiResponse } from '../types/api.types';
import { User } from '../types/user.types';

export const AuthService = {
    async getCurrentUser(): Promise<ApiResponse<User>> {
        return fetchHandler('/api/auth/me');
    },

    async logout(): Promise<ApiResponse<void>> {
        return fetchHandler('/api/auth/logout', { method: 'POST' });
    }
};
