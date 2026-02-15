import { fetchHandler } from './client';
import { ApiResponse } from '../types/api.types';
import { User } from '../types/user.types';

export const AuthService = {
    async getCurrentUser(): Promise<ApiResponse<User>> {
        return fetchHandler<ApiResponse<User>>('/api/auth/me');
    },

    async logout(): Promise<ApiResponse<void>> {
        return fetchHandler<ApiResponse<void>>('/api/auth/logout', { method: 'POST' });
    }
};
