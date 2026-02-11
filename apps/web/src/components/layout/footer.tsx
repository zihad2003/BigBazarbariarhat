'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';

const footerLinks = {
    shop: [
        { name: 'Men', href: '/men' },
        { name: 'Women', href: '/women' },
        { name: 'Kids', href: '/kids' },
        { name: 'Accessories', href: '/accessories' },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Sale', href: '/sale' },
    ],
    help: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Track Order', href: '/track-order' },
    ],
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Store Locations', href: '/stores' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press', href: '/press' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Cookie Policy', href: '/cookies' },
    ],
};

const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'bKash', icon: '📱' },
    { name: 'Nagad', icon: '📱' },
    { name: 'Rocket', icon: '📱' },
    { name: 'COD', icon: '💵' },
];

const features = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders over ৳2000' },
    { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
    { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
    { icon: CreditCard, title: 'Multiple Payment', description: 'bKash, Nagad, Cards' },
];

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Features Bar */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                                    <feature.icon className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                                    <p className="text-xs text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-2xl font-black uppercase tracking-tighter bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Big Bazar
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-6 max-w-xs">
                            Your one-stop destination for premium fashion from top brands. Quality clothing for the whole family.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <a href="tel:+8801234567890" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                                <Phone className="h-4 w-4" />
                                +880 1234-567890
                            </a>
                            <a href="mailto:support@bigbazar.com" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                                <Mail className="h-4 w-4" />
                                support@bigbazar.com
                            </a>
                            <a
                                href="https://www.google.com/maps?q=22.894359,91.535009"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                            >
                                <MapPin className="h-4 w-4" />
                                Bariarhat, Mirsharai, Chattogram
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/profile.php?id=100063541603515"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h3>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Help</h3>
                        <ul className="space-y-2">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Big Bazar. All rights reserved.
                        </p>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 mr-2">We Accept:</span>
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.name}
                                    className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs"
                                    title={method.name}
                                >
                                    {method.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
