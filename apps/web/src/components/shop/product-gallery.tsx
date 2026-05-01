'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
    images: { id: string; url: string; altText?: string | null }[]
    productName: string
    discount?: number
}

export function ProductGallery({ images, productName, discount = 0 }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setMousePos({ x, y })
    }

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                No Image Available
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
                className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm border border-gray-200 group cursor-crosshair"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                <Image
                    src={images[activeImage].url}
                    alt={images[activeImage].altText || productName}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-200",
                        isZoomed ? "scale-150" : "scale-100"
                    )}
                    style={isZoomed ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                    } : undefined}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {discount > 0 && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider shadow-md">
                            -{discount}%
                        </span>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setActiveImage(index)}
                            aria-label={`View image ${index + 1}`}
                            className={cn(
                                "relative aspect-square overflow-hidden bg-gray-100 border transition-all hover:opacity-100",
                                activeImage === index
                                    ? "border-black ring-1 ring-black opacity-100"
                                    : "border-transparent opacity-60 hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={image.altText || productName}
                                fill
                                className="object-cover"
                                sizes="100px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
