'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { useEffect } from 'react';
import { useLanguageStore, SettingsService } from '@bigbazar/shared';

function LanguageInitializer({ children }: { children: React.ReactNode }) {
    const { setLanguage } = useLanguageStore();

    useEffect(() => {
        const initLanguage = async () => {
            try {
                const result = await SettingsService.getSettings();
                if (result.success && result.data?.default_language) {
                    setLanguage(result.data.default_language as any);
                }
            } catch (error) {
                console.error('Failed to initialize language from admin settings:', error);
            }
        };
        initLanguage();
    }, [setLanguage]);

    return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                <LanguageInitializer>
                    {children}
                </LanguageInitializer>
            </QueryClientProvider>
        </ClerkProvider>
    );
}
