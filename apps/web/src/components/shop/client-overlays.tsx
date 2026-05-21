'use client';

import dynamic from 'next/dynamic';

const SearchModal = dynamic(() => import('./search-modal').then(mod => mod.SearchModal), {
    ssr: false
});

const CartDrawer = dynamic(() => import('./cart-drawer').then(mod => mod.CartDrawer), {
    ssr: false
});

export function ClientOverlays() {
    return (
        <>
            <SearchModal />
            <CartDrawer />
        </>
    );
}
