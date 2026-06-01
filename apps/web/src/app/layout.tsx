import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Lato } from 'next/font/google';
import Providers from './providers';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: {
    default: "Big Bazar Bariarhat — Your Local Online Shop",
    template: "%s | Big Bazar Bariarhat",
  },
  description: "Shop online from Big Bazar Bariarhat. Best prices on groceries, electronics, clothing and more delivered to your door in Bariarhat.",
  metadataBase: new URL("https://bigbazarbariarhat.pages.dev"),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://bigbazarbariarhat.pages.dev",
    siteName: "Big Bazar Bariarhat",
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${lato.variable}`}>
      <body className={`${lato.className} bg-background text-foreground`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'rounded-2xl border-slate-100 shadow-2xl font-black uppercase tracking-widest text-[10px]',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
