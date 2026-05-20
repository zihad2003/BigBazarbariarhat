'use client'

import { Facebook, Twitter, Linkedin, Link2, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialShareProps {
    url: string
    title: string
    className?: string
}

export function SocialShare({ url, title, className }: SocialShareProps) {
    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(url)
        const encodedTitle = encodeURIComponent(title)

        const urls: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
        }

        if (platform === 'copy') {
            navigator.clipboard.writeText(url)
            alert('Link copied to clipboard')
            return
        }

        window.open(urls[platform] || '', '_blank', 'width=600,height=400')
    }

    return (
        <div className={cn("flex items-center gap-4 mt-6", className)}>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Share:</span>
            <div className="flex gap-2">
                <button
                    onClick={() => handleShare('facebook')}
                    aria-label="Share on Facebook"
                    className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                    <Facebook className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleShare('twitter')}
                    aria-label="Share on Twitter"
                    className="p-2 rounded-full hover:bg-sky-50 text-gray-400 hover:text-sky-500 transition-colors cursor-pointer"
                >
                    <Twitter className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleShare('linkedin')}
                    aria-label="Share on LinkedIn"
                    className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-700 transition-colors cursor-pointer"
                >
                    <Linkedin className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleShare('email')}
                    aria-label="Share via Email"
                    className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                >
                    <Mail className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleShare('copy')}
                    aria-label="Copy Link"
                    className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                >
                    <Link2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

