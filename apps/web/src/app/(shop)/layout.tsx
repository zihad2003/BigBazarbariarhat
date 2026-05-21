import { Header, Footer } from '@/components/layout'
import { Toaster } from '@/components/ui/toaster'
import { ClientOverlays } from '@/components/shop/client-overlays'

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <ClientOverlays />
            <Toaster />
            <main className="min-h-screen pb-24 md:pb-0">
                {children}
            </main>
            <Footer />
        </>
    )
}
