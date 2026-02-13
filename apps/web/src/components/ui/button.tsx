import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest",
    {
        variants: {
            variant: {
                default: "bg-luxury-gold text-luxury-black hover:bg-white hover:text-luxury-black shadow-luxury hover:shadow-luxury-lg btn-luxury-glow",
                destructive:
                    "bg-luxury-red text-white hover:bg-luxury-red-bright shadow-luxury hover:shadow-luxury-lg btn-luxury-glow",
                outline:
                    "border-2 border-luxury-gold text-luxury-gold bg-transparent hover:bg-luxury-gold hover:text-luxury-black hover:shadow-luxury-gold transition-all duration-300",
                outlineRed:
                    "border-2 border-luxury-red text-luxury-red bg-transparent hover:bg-luxury-red hover:text-white hover:shadow-luxury transition-all duration-300",
                secondary:
                    "bg-luxury-black-lighter text-white hover:bg-luxury-black-card border border-luxury-black-lighter hover:border-luxury-gold/50 transition-all duration-300",
                ghost: "hover:bg-luxury-gold/10 hover:text-luxury-gold transition-all duration-300",
                ghostRed: "hover:bg-luxury-red/10 hover:text-luxury-red transition-all duration-300",
                link: "text-luxury-gold underline-offset-4 hover:underline link-luxury",
                luxury: "bg-gradient-to-r from-luxury-gold-dark via-luxury-gold to-luxury-gold-bright text-luxury-black hover:from-luxury-gold hover:via-luxury-gold-bright hover:to-white shadow-luxury-gold btn-luxury-glow",
                luxuryRed: "bg-gradient-to-r from-luxury-red via-luxury-red-accent to-luxury-red-bright text-white hover:from-luxury-red-bright hover:via-luxury-red-accent hover:to-luxury-red shadow-luxury btn-luxury-glow",
            },
            size: {
                default: "h-10 px-6 py-2 rounded-sm",
                sm: "h-8 rounded-sm px-4 text-[10px]",
                lg: "h-12 rounded-sm px-10 text-sm",
                icon: "h-10 w-10 rounded-sm p-0",
                xl: "h-14 rounded-sm px-12 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
