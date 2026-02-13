import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-sm border border-luxury-black-lighter bg-luxury-black-card text-card-foreground shadow-luxury transition-all duration-300",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6 border-b border-luxury-black-lighter", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight text-white font-playfair",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-gray-400 font-lato", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0 border-t border-luxury-black-lighter", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

// Luxury Card Variants
const LuxuryCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { variant?: 'gold' | 'red' | 'glass' }
>(({ className, variant = 'gold', ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-sm shadow-luxury transition-all duration-300 card-luxury-hover",
            variant === 'gold' && "border-luxury border-luxury-gold/20 bg-luxury-black-card",
            variant === 'red' && "border-luxury-red border-luxury-red/20 bg-luxury-black-card",
            variant === 'glass' && "glass-luxury border-luxury-gold/30",
            className
        )}
        {...props}
    />
))
LuxuryCard.displayName = "LuxuryCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, LuxuryCard }
