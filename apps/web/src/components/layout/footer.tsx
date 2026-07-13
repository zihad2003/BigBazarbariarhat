'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone, Mail, CreditCard, Truck, Shield, ChevronDown } from 'lucide-react';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { cn } from '@/lib/utils';

export function Footer() {
    const { language, setLanguage } = useLanguageStore();
    const t = useTranslation();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        shop: false,
        help: false,
        company: false,
        legal: false,
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const footerLinks = {
        shop: [
            { name: t?.categories?.men || 'Men', href: '/products?category=men' },
            { name: t?.categories?.women || 'Women', href: '/products?category=women' },
            { name: t?.categories?.kidsBoys || 'Kids(Boys)', href: '/products?category=kids-boys' },
            { name: t?.categories?.kidsGirls || 'Kids(Girls)', href: '/products?category=kids-girls' },
            { name: t?.newArrivals?.title || 'New Arrivals', href: '/products?sort=newest' },
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
            { name: 'Store Locations', href: '/stores' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Refund Policy', href: '/refund-policy' },
        ],
    };

    const features = [
        { icon: Truck, title: t?.features?.freeShipping || 'Free Shipping', description: t?.features?.freeShippingDesc || 'For Mirsharai' },
        { icon: Shield, title: t?.features?.securePayment || 'Secure Payment', description: t?.features?.securePaymentDesc || '100% secure checkout' },
        { icon: CreditCard, title: 'Mobile Banking', description: 'bKash & Nagad' },
    ];

    const paymentMethods = [
        { name: 'bKash', color: 'text-[#E2136E]', border: 'border-[#E2136E]/20 hover:border-[#E2136E]/60', logo: '/payments/bkash.png' },
        { name: 'Nagad', color: 'text-[#ED1C24]', border: 'border-[#ED1C24]/20 hover:border-[#ED1C24]/60', logo: '/payments/nagad.png' },
        { name: 'COD', color: 'text-foreground', border: 'border-border hover:border-foreground/50' },
    ];

    return (
        <footer className="bg-background text-muted-foreground border-t border-border font-lato pb-24 md:pb-0">
            {/* Features Bar */}
            <div className="border-b border-border bg-gradient-to-r from-background via-card to-background relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 sm:py-10 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex items-center gap-3 sm:gap-5 group p-3 sm:p-4 rounded-2xl hover:bg-card/50 transition-colors duration-300 border border-transparent hover:border-border/50">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-background rounded-full flex items-center justify-center border border-border shadow-sm group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/10 group-hover:scale-110 transition-all duration-300">
                                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-playfair font-bold text-foreground text-sm uppercase tracking-wider mb-1 group-hover:text-primary transition-colors">{feature.title}</h4>
                                    <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10">
                    {/* Brand Column */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-8">
                        <Link href="/" className="inline-block group">
                            <span className="text-3xl font-black uppercase font-playfair-sc transition-colors duration-300">
                                <span className="text-[#FF0000]">BIG</span> <span className="text-black">BAZAR</span>
                            </span>
                            <div className="h-0.5 w-12 bg-[#FF0000] mt-2 group-hover:w-full transition-all duration-500" />
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
                    <div className="border-b border-border/40 sm:border-none py-3 sm:py-0">
                        <button
                            type="button"
                            onClick={() => toggleSection('shop')}
                            className="flex items-center justify-between w-full sm:cursor-default text-left group"
                        >
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] font-playfair sm:mb-6">Shop</h3>
                            <ChevronDown className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-300 sm:hidden",
                                openSections.shop && "rotate-180"
                            )} />
                        </button>
                        <ul className={cn(
                            "space-y-3 mt-4 sm:mt-0 transition-all duration-300 sm:block",
                            openSections.shop ? "block" : "hidden"
                        )}>
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 block w-fit relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-destructive hover:after:w-full after:transition-all after:duration-300">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div className="border-b border-border/40 sm:border-none py-3 sm:py-0">
                        <button
                            type="button"
                            onClick={() => toggleSection('help')}
                            className="flex items-center justify-between w-full sm:cursor-default text-left group"
                        >
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] font-playfair sm:mb-6">Help</h3>
                            <ChevronDown className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-300 sm:hidden",
                                openSections.help && "rotate-180"
                            )} />
                        </button>
                        <ul className={cn(
                            "space-y-3 mt-4 sm:mt-0 transition-all duration-300 sm:block",
                            openSections.help ? "block" : "hidden"
                        )}>
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 block w-fit relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-destructive hover:after:w-full after:transition-all after:duration-300">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="border-b border-border/40 sm:border-none py-3 sm:py-0">
                        <button
                            type="button"
                            onClick={() => toggleSection('company')}
                            className="flex items-center justify-between w-full sm:cursor-default text-left group"
                        >
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] font-playfair sm:mb-6">Company</h3>
                            <ChevronDown className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-300 sm:hidden",
                                openSections.company && "rotate-180"
                            )} />
                        </button>
                        <ul className={cn(
                            "space-y-3 mt-4 sm:mt-0 transition-all duration-300 sm:block",
                            openSections.company ? "block" : "hidden"
                        )}>
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 block w-fit relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-destructive hover:after:w-full after:transition-all after:duration-300">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="border-b border-border/40 sm:border-none py-3 sm:py-0">
                        <button
                            type="button"
                            onClick={() => toggleSection('legal')}
                            className="flex items-center justify-between w-full sm:cursor-default text-left group"
                        >
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] font-playfair sm:mb-6">Legal</h3>
                            <ChevronDown className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-300 sm:hidden",
                                openSections.legal && "rotate-180"
                            )} />
                        </button>
                        <ul className={cn(
                            "space-y-3 mt-4 sm:mt-0 transition-all duration-300 sm:block",
                            openSections.legal ? "block" : "hidden"
                        )}>
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 block w-fit relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-destructive hover:after:w-full after:transition-all after:duration-300">
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
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <p className="text-xs text-muted-foreground font-medium">
                                © {new Date().getFullYear()} BIG BAZAR. All rights reserved.
                            </p>

                            {/* Language Switcher */}
                            <div className="flex items-center bg-background border border-border rounded-full p-1 shadow-sm">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${language === 'en' ? 'bg-destructive text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setLanguage('bn')}
                                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${language === 'bn' ? 'bg-destructive text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    বাংলা
                                </button>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center justify-center flex-wrap gap-2">
                            <span className="text-[10px] text-gray-500 mr-2 uppercase tracking-widest w-full sm:w-auto mb-1 sm:mb-0 font-bold">We Accept:</span>
                            {paymentMethods.map((method) => (
                                <span key={method.name} className={`px-3 py-1 bg-background border rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-default flex items-center gap-1.5 shadow-sm ${method.color} ${method.border}`}>
                                    {method.logo && (
                                        <img src={method.logo} alt={method.name} className="h-3 object-contain" />
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
