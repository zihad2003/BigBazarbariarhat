import { Header, Footer } from '@/components/layout'
import { SearchModal } from '@/components/shop/search-modal'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { Toaster } from '@/components/ui/toaster'

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <SearchModal />
            <CartDrawer />
            <Toaster />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    )
}
