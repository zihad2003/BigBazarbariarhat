import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number, language: 'en' | 'bn' = 'en'): string {
    const locale = language === 'bn' ? 'bn-BD' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
        currencyDisplay: 'symbol',
    }).format(price).replace('BDT', '৳').replace('TK', '৳')
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}
