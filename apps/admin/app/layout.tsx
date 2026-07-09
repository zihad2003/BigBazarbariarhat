export const runtime = 'edge';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/providers/theme-provider';
import QueryProvider from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = localFont({
    src: '../public/fonts/Inter-Variable.woff2',
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Big Bazar — Admin',
    description: 'Admin dashboard for Big Bazar e-commerce platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <body className={`${inter.className} min-h-screen`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    <QueryProvider>
                        {children}
                        <Toaster />
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
