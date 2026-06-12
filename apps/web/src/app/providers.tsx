'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
// import dynamic from 'next/dynamic';

import { useEffect } from 'react';
import { useLanguageStore, SettingsService } from '@bigbazar/shared';

// const Agentation = dynamic(
//     () => import('agentation').then((mod) => mod.Agentation),
//     { ssr: false }
// );

function LanguageInitializer({ children }: { children: React.ReactNode }) {
    const { setLanguage } = useLanguageStore();

    useEffect(() => {
        const initLanguage = async () => {
            try {
                // If the user already has a persisted language choice, respect it
                const storedValue = localStorage.getItem('language-storage');
                if (storedValue) {
                    try {
                        const parsed = JSON.parse(storedValue);
                        if (parsed?.state?.language === 'en' || parsed?.state?.language === 'bn') {
                            return;
                        }
                    } catch (e) {
                        // Ignore JSON parsing errors
                    }
                }

                // Otherwise, initialize from admin settings
                const result = await SettingsService.getSettings();
                if (result.success && result.data?.default_language) {
                    setLanguage(result.data.default_language as any);
                } else {
                    setLanguage('en');
                }
            } catch (error) {
                console.error('Failed to initialize language from admin settings:', error);
                setLanguage('en');
            }
        };
        initLanguage();
    }, [setLanguage]);

    return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <LanguageInitializer>
                    {children}
                    {/* {process.env.NODE_ENV === 'development' && <Agentation endpoint="http://localhost:4747" />} */}
                </LanguageInitializer>
            </QueryClientProvider>
        </SessionProvider>
    );
}

