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
        <footer className="bg-luxury-black text-gray-300 border-t border-luxury-black-lighter font-lato">
            {/* Features Bar */}
            <div className="border-b border-luxury-black-lighter">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex items-center gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-luxury-black-card rounded-full flex items-center justify-center border border-luxury-black-lighter group-hover:border-luxury-gold transition-colors duration-300">
                                    <feature.icon className="h-5 w-5 text-luxury-gold" />
                                </div>
                                <div>
                                    <h4 className="font-playfair font-bold text-white text-sm uppercase tracking-wider mb-1">{feature.title}</h4>
                                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
                    {/* Brand Column */}
                    <div className="col-span-2 space-y-8">
                        <Link href="/" className="inline-block group">
                            <span className="text-3xl font-black uppercase tracking-[0.15em] text-white font-playfair group-hover:text-luxury-gold transition-colors duration-300">
                                Big Bazar
                            </span>
                            <div className="h-0.5 w-12 bg-luxury-gold mt-2 group-hover:w-full transition-all duration-500"></div>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                            Your one-stop destination for premium fashion from top brands. Quality clothing for the whole family.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <a href="tel:+8801234567890" className="flex items-center gap-3 text-sm text-gray-400 hover:text-luxury-gold transition-colors">
                                <Phone className="h-4 w-4 text-luxury-gold" />
                                +880 1234-567890
                            </a>
                            <a href="mailto:support@bigbazar.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-luxury-gold transition-colors">
                                <Mail className="h-4 w-4 text-luxury-gold" />
                                support@bigbazar.com
                            </a>
                            <a
                                href="https://www.google.com/maps?q=22.894359,91.535009"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-gray-400 hover:text-luxury-gold transition-colors"
                            >
                                <MapPin className="h-4 w-4 text-luxury-gold" />
                                Bariarhat, Mirsharai, Chattogram
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 pt-2">
                            <a
                                href="https://www.facebook.com/profile.php?id=100063541603515"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-10 h-10 bg-luxury-black-card border border-luxury-black-lighter rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-luxury-gold hover:border-luxury-gold transition-all duration-300"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="w-10 h-10 bg-luxury-black-card border border-luxury-black-lighter rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-luxury-gold hover:border-luxury-gold transition-all duration-300"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="w-10 h-10 bg-luxury-black-card border border-luxury-black-lighter rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-luxury-gold hover:border-luxury-gold transition-all duration-300"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                aria-label="Youtube"
                                className="w-10 h-10 bg-luxury-black-card border border-luxury-black-lighter rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-luxury-gold hover:border-luxury-gold transition-all duration-300"
                            >
                                <Youtube className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-luxury-gold uppercase tracking-[0.2em] mb-6 font-playfair">Shop</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-luxury-gold uppercase tracking-[0.2em] mb-6 font-playfair">Help</h3>
                        <ul className="space-y-3">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-luxury-gold uppercase tracking-[0.2em] mb-6 font-playfair">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-luxury-gold uppercase tracking-[0.2em] mb-6 font-playfair">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-luxury-black-lighter bg-luxury-black-card">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-500 tracking-wide">
                            © {new Date().getFullYear()} Big Bazar. Crafted for the extraordinary.
                        </p>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 mr-2 uppercase tracking-wider">We Accept:</span>
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.name}
                                    className="w-10 h-6 bg-luxury-black border border-luxury-black-lighter rounded flex items-center justify-center text-xs text-gray-400"
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
