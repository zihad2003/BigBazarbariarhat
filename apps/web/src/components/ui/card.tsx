import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-sm border border-border bg-card text-card-foreground shadow-sm transition-all duration-300",
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
        className={cn("flex flex-col space-y-1.5 p-6 border-b border-border", className)}
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
            "text-2xl font-semibold leading-none tracking-tight text-foreground font-playfair",
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
        className={cn("text-sm text-muted-foreground font-lato", className)}
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
        className={cn("flex items-center p-6 pt-0 border-t border-border", className)}
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
            variant === 'gold' && "border border-luxury-gold/20 bg-card",
            variant === 'red' && "border border-luxury-red/20 bg-card",
            variant === 'glass' && "bg-white/40 backdrop-blur-md border border-luxury-gold/30 shadow-lg",
            className
        )}
        {...props}
    />
))
LuxuryCard.displayName = "LuxuryCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, LuxuryCard }
