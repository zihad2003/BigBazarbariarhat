import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Lato } from 'next/font/google';
import Providers from './providers';
import { ToastContainer } from '@/components/toast-container';
import { Preloader } from '@/components/preloader';
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
    default: 'Big Bazar | Premium Essentials for the Sport of Life',
    template: '%s | Big Bazar Bariarhat',
  },
  description:
    'Premium quality basics designed for the boardroom, the beach, and everywhere in between. Shop clothing, home décor, and accessories at Big Bazar Bariarhat.',
  keywords: [
    'big bazar',
    'bariarhat',
    'e-commerce',
    'clothing',
    'fashion',
    'premium',
    'essentials',
  ],
  authors: [{ name: 'Big Bazar Bariarhat' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Big Bazar Bariarhat',
    title: 'Big Bazar | Premium Essentials for the Sport of Life',
    description: 'Premium quality basics designed for the boardroom, the beach, and everywhere in between.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Bazar | Premium Essentials',
    description: 'Premium quality basics for the sport of life.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
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
      <body className={`${lato.className} bg-luxury-black text-foreground`}>
        <Providers>
          {children}
          <Preloader />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
