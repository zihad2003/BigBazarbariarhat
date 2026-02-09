import Link from 'next/link'

const footerLinks = {
    shop: [
        { name: "Men's All", href: '/men' },
        { name: "Women's All", href: '/women' },
        { name: 'Kids', href: '/kids' },
        { name: 'Home Decor', href: '/home-decor' },
    ],
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Press', href: '/press' },
    ],
    support: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Contact Us', href: '/contact' },
    ],
    account: [
        { name: 'My Account', href: '/account' },
        { name: 'Order Tracking', href: '/orders' },
        { name: 'Points', href: '/rewards' },
    ],
}

export function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                {/* Footer Grid */}
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {/* Shop */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-6">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-6">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-6">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-6">
                            Account
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.account.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © 2025 Big Bazar | Premium Essentials
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-xs text-gray-500 hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-gray-500 hover:text-white">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
