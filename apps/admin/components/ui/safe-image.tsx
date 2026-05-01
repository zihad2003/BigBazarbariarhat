'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SafeImageProps {
    src?: string;
    alt: string;
    className?: string;
}

export function SafeImage({ src, alt, className }: SafeImageProps) {
    const [errored, setErrored] = useState(false);

    // Reset error state when the src URL changes so a new valid URL isn't
    // permanently stuck showing the placeholder.
    useEffect(() => {
        setErrored(false);
    }, [src]);

    const showPlaceholder = errored || !src;

    return (
        <img
            src={showPlaceholder ? '/placeholder.png' : src}
            alt={alt}
            loading="lazy"
            // Guard: if placeholder.png itself fails, do not loop by skipping
            // the setter when we're already on the placeholder.
            onError={() => { if (!showPlaceholder) setErrored(true); }}
            className={cn('object-cover', className)}
        />
    );
}
