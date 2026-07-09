export const runtime = 'edge';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Providers from './providers';
import { Toaster } from '@/components/ui/toaster';
import { cookies } from 'next/headers';
import './globals.css';

const playfair = localFont({
  src: '../../public/fonts/PlayfairDisplay-Variable.woff2',
  variable: '--font-playfair',
  display: 'swap',
});

const lato = localFont({
  src: [
    {
      path: '../../public/fonts/Lato-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lato-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-lato',
  display: 'swap',
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Big Bazar Bariarhat — Your Local Online Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Bazar Bariarhat — Your Local Online Shop",
    description: "Shop online from Big Bazar Bariarhat. Best prices on groceries, electronics, clothing and more delivered to your door in Bariarhat.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('language')?.value || 'en';

  return (
    <html lang={lang} className={`${playfair.variable} ${lato.variable}`}>
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
