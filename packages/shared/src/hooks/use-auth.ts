import { create } from 'zustand';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    role?: 'admin' | 'customer';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setToken: (token) => set({ token }),
    setLoading: (loading) => set({ isLoading: loading }),
    logout: () => set({ user: null, isAuthenticated: false, token: null, isLoading: false }),
}));

export const useAuth = () => useAuthStore();
