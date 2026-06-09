'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useEffect } from 'react';
import { useLanguageStore, SettingsService } from '@bigbazar/shared';

const Agentation = dynamic(
    () => import('agentation').then((mod) => mod.Agentation),
    { ssr: false }
);

function LanguageInitializer({ children }: { children: React.ReactNode }) {
    const { setLanguage } = useLanguageStore();

    useEffect(() => {
        const initLanguage = async () => {
            try {
                // If the user initially loads /cart or /checkout, force 'bn' (Bangla)
                const initialPath = window.location.pathname;
                if (initialPath === '/cart' || initialPath === '/checkout') {
                    setLanguage('bn');
                    return;
                }

                const result = await SettingsService.getSettings();
                if (result.success && result.data?.default_language) {
                    // Check current path again in case they navigated to cart/checkout during fetch
                    const currentPath = window.location.pathname;
                    if (currentPath === '/cart' || currentPath === '/checkout') {
                        setLanguage('bn');
                    } else {
                        setLanguage(result.data.default_language as any);
                    }
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
        <QueryClientProvider client={queryClient}>
            <LanguageInitializer>
                {children}
                {process.env.NODE_ENV === 'development' && <Agentation endpoint="http://localhost:4747" />}
            </LanguageInitializer>
        </QueryClientProvider>
    );
}
