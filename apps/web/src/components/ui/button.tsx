import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest",
    {
        variants: {
            variant: {
                default: "bg-luxury-gold text-luxury-black hover:bg-white hover:text-luxury-black shadow-lg hover:shadow-xl",
                destructive:
                    "bg-luxury-red text-white hover:bg-luxury-red-bright",
                outline:
                    "border border-luxury-gold text-luxury-gold bg-transparent hover:bg-luxury-gold hover:text-luxury-black",
                secondary:
                    "bg-luxury-black-lighter text-white hover:bg-luxury-black-card border border-luxury-black-lighter",
                ghost: "hover:bg-luxury-gold/10 hover:text-luxury-gold",
                link: "text-luxury-gold underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-6 py-2 rounded-sm",
                sm: "h-8 rounded-sm px-4 text-[10px]",
                lg: "h-12 rounded-sm px-10 text-sm",
                icon: "h-10 w-10 rounded-sm p-0",
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
