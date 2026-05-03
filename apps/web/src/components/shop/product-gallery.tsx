'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
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

    const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length)
    const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length)

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-[4/5] bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
                No Visual Record Available
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Desktop Thumbnails Column */}
            <div className="hidden md:flex flex-col gap-4 w-24 shrink-0">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => setActiveImage(index)}
                        className={cn(
                            "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group",
                            activeImage === index
                                ? "border-black shadow-xl shadow-black/5 scale-105"
                                : "border-gray-100 opacity-50 hover:opacity-100"
                        )}
                    >
                        <Image
                            src={image.url}
                            alt={`${productName} thumbnail ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="100px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Stage Module */}
            <div className="relative flex-1 group">
                <div
                    className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-[2.5rem] lg:rounded-[3.5rem] border border-gray-100 cursor-crosshair"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full h-full"
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
                                sizes="(max-width: 768px) 100vw, 800px"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Overlays */}
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-gray-900 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 disabled:opacity-0"
                            disabled={images.length <= 1}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-gray-900 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 disabled:opacity-0"
                            disabled={images.length <= 1}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Badge Module */}
                    {discount > 0 && (
                        <div className="absolute top-8 left-8 z-10">
                            <div className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20">
                                -{discount}% Off
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-8 right-8 z-10">
                        <div className="bg-black/5 backdrop-blur-md text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Mobile Thumbnails Row */}
                <div className="flex md:hidden gap-3 mt-6 overflow-x-auto no-scrollbar pb-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setActiveImage(index)}
                            className={cn(
                                "relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all",
                                activeImage === index
                                    ? "border-black scale-105"
                                    : "border-gray-100 opacity-50"
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
