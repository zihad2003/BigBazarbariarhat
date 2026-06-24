import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import Providers from './providers';
import { Toaster } from '@/components/ui/toaster';
import { cookies } from 'next/headers';
import './globals.css';

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
