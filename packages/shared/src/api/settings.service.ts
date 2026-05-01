import { ApiClient } from './client';
import { ApiResponse } from '../types/api.types';

export interface StoreSettings {
    id: string;
    store_name: string;
    store_description: string;
    support_email: string;
    currency: string;
    default_language: string;
    logo_url?: string;
    social_links?: any;
    footer_text?: string;
}

export class SettingsService {
    static async getSettings(): Promise<ApiResponse<StoreSettings>> {
        return ApiClient.get<ApiResponse<StoreSettings>>('/api/settings');
    }

    static async updateSettings(settings: Partial<StoreSettings>): Promise<ApiResponse<StoreSettings>> {
        return ApiClient.post<ApiResponse<StoreSettings>>('/api/settings', settings);
    }
}
