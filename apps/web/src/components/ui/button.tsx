import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest relative overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-luxury-gold text-black hover:bg-black hover:text-white shadow-sm hover:shadow-md transition-all duration-300",
                destructive: "bg-luxury-red text-white hover:bg-luxury-red-bright shadow-sm hover:shadow-md transition-all duration-300",
                outline: "border-2 border-luxury-gold text-luxury-gold bg-transparent hover:bg-luxury-gold hover:text-black transition-all duration-300",
                outlineRed:
                    "border-2 border-luxury-red text-luxury-red bg-transparent hover:bg-luxury-red hover:text-white hover:shadow-luxury transition-all duration-300",
                secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 transition-all duration-300",
                ghost: "hover:bg-luxury-gold/10 hover:text-luxury-gold transition-all duration-300",
                ghostRed: "hover:bg-luxury-red/10 hover:text-luxury-red transition-all duration-300",
                link: "text-luxury-gold underline-offset-4 hover:underline link-luxury",
                luxury: "bg-gradient-to-r from-luxury-gold-dark via-luxury-gold to-luxury-gold-bright text-black hover:from-luxury-gold hover:via-luxury-gold-bright hover:to-white shadow-md",
                luxuryRed: "bg-gradient-to-r from-luxury-red via-luxury-red-accent to-luxury-red-bright text-white hover:from-luxury-red-bright hover:via-luxury-red-accent hover:to-luxury-red shadow-md",
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
    isLoading?: boolean
    loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, loadingText, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {loadingText || "Please wait"}
                    </>
                ) : (
                    children
                )}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
