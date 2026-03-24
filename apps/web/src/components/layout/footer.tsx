'use client';

import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Mail, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';

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
    { name: 'bKash', color: 'text-[#E2136E]', border: 'border-[#E2136E]/20 hover:border-[#E2136E]/60', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BKash_logo.svg/512px-BKash_logo.svg.png' },
    { name: 'Nagad', color: 'text-[#ED1C24]', border: 'border-[#ED1C24]/20 hover:border-[#ED1C24]/60', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Nagad_Logo.svg/512px-Nagad_Logo.svg.png' },
    { name: 'COD', color: 'text-foreground', border: 'border-border hover:border-foreground/50' },
];

const features = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders over ৳2000' },
    { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
    { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
    { icon: CreditCard, title: 'Mobile Banking', description: 'bKash & Nagad' },
];

export function Footer() {
    return (
        <footer className="bg-background text-muted-foreground border-t border-border font-lato">
            {/* Features Bar */}
            <div className="border-b border-border">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex items-center gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-card rounded-full flex items-center justify-center border border-border group-hover:border-destructive group-hover:text-destructive transition-colors duration-300">
                                    <feature.icon className="h-5 w-5 transition-colors group-hover:text-destructive" />
                                </div>
                                <div>
                                    <h4 className="font-playfair font-bold text-foreground text-sm uppercase tracking-wider mb-1">{feature.title}</h4>
                                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
                    {/* Brand Column */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-8">
                        <Link href="/" className="inline-block group">
                            <span className="text-3xl font-black uppercase tracking-[0.15em] font-playfair transition-colors duration-300">
                                <span className="text-destructive">BIG</span> <span className="text-foreground">BAZAR</span>
                            </span>
                            <div className="h-0.5 w-12 bg-destructive mt-2 group-hover:w-full transition-all duration-500" />
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Your one-stop destination for premium fashion from top brands. Quality clothing for the whole family.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <a href="tel:01857045449" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-destructive transition-colors">
                                <Phone className="h-4 w-4" />
                                01857045449
                            </a>
                            <a href="mailto:infobigbazar01@gmail.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-destructive transition-colors">
                                <Mail className="h-4 w-4" />
                                infobigbazar01@gmail.com
                            </a>
                            <a
                                href="https://www.google.com/maps?q=22.894359,91.535009"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <MapPin className="h-4 w-4" />
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
                                className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-white hover:bg-destructive hover:border-destructive transition-all duration-300"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.instagram.com/big_bazar_25/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-white hover:bg-destructive hover:border-destructive transition-all duration-300"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@big.bazar2"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-white hover:bg-destructive hover:border-destructive transition-all duration-300"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-2">
                                    <circle cx="8" cy="18" r="4" />
                                    <path d="M12 18V2l7 4" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] mb-6 font-playfair">Shop</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-destructive hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] mb-6 font-playfair">Help</h3>
                        <ul className="space-y-3">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-destructive hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] mb-6 font-playfair">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-destructive hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] mb-6 font-playfair">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-destructive hover:pl-2 transition-all duration-300 block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border bg-card">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} BIG BAZAR. All rights reserved.
                        </p>

                        {/* Payment Methods */}
                        <div className="flex items-center justify-center flex-wrap gap-2">
                            <span className="text-xs text-gray-500 mr-2 uppercase tracking-wider w-full sm:w-auto mb-1 sm:mb-0">We Accept:</span>
                            {paymentMethods.map((method) => (
                                <span key={method.name} className={`px-3 py-1 bg-card border rounded text-xs font-black uppercase tracking-wider transition-all cursor-default flex items-center gap-1.5 ${method.color} ${method.border}`}>
                                    {method.logo && (
                                        <img src={method.logo} alt={method.name} className="h-3.5 object-contain" />
                                    )}
                                    {method.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
