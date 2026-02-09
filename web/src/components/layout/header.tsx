'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const navigation = [
    { name: 'Men', href: '/men' },
    { name: 'Women', href: '/women' },
    { name: 'Kids', href: '/kids' },
    { name: 'Home Decor', href: '/home-decor' },
]

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user } = useUser()

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-black text-white text-center py-2.5 text-xs font-semibold tracking-wider uppercase">
                Free International Shipping on Orders $150+
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-extrabold uppercase tracking-tight">
                            Big Bazar
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:gap-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium uppercase tracking-wide text-gray-600 hover:text-black transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-in">
                                <Button variant="ghost" size="sm">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                        </SignedOut>

                        <Link href="/cart" className="relative">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="text-sm font-semibold uppercase">Cart</span>
                                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </Button>
                        </Link>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200">
                        <div className="space-y-1 px-6 pb-4 pt-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block py-3 text-sm font-medium uppercase tracking-wide text-gray-600 hover:text-black"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}
