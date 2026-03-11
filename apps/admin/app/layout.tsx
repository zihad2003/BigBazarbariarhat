import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/theme-provider';
import QueryProvider from '@/components/providers/query-provider';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Big Bazar Admin',
    description: 'Admin dashboard for Big Bazar e-commerce platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider
            appearance={{
                variables: { colorPrimary: '#1a6b3c' },
                elements: {
                    formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                    card: 'bg-card text-card-foreground shadow-md',
                    headerTitle: 'text-foreground',
                    headerSubtitle: 'text-muted-foreground',
                    socialButtonsBlockButton: 'border-border text-foreground hover:bg-accent/50',
                    socialButtonsBlockButtonText: 'font-semibold',
                    formFieldLabel: 'text-foreground',
                    formFieldInput: 'bg-background border-input text-foreground focus:ring-primary',
                    footerActionLink: 'text-primary hover:text-primary/90',
                }
            }}
        >
            <html lang="en" suppressHydrationWarning>
                <body className={inter.className}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <QueryProvider>
                            {children}
                            <Toaster />
                        </QueryProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
