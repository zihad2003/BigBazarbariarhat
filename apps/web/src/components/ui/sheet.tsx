'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetContextValue {
    open: boolean
    setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue>({
    open: false,
    setOpen: () => { },
})

function Sheet({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    )
}

function SheetTrigger({
    children,
    asChild,
    ...props
}: {
    children: React.ReactNode
    asChild?: boolean
    className?: string
}) {
    const { setOpen } = React.useContext(SheetContext)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            ...props,
            onClick: (e: React.MouseEvent) => {
                setOpen(true)
                const childOnClick = (children as React.ReactElement<any>).props?.onClick
                if (childOnClick) childOnClick(e)
            },
        })
    }

    return (
        <button onClick={() => setOpen(true)} {...props}>
            {children}
        </button>
    )
}

function SheetContent({
    children,
    side = 'right',
    className,
}: {
    children: React.ReactNode
    side?: 'left' | 'right' | 'top' | 'bottom'
    className?: string
}) {
    const { open, setOpen } = React.useContext(SheetContext)

    if (!open) return null

    const sideClasses = {
        left: 'inset-y-0 left-0 w-80 animate-slide-in-left',
        right: 'inset-y-0 right-0 w-80 animate-slide-in-right',
        top: 'inset-x-0 top-0 h-80 animate-slide-in-top',
        bottom: 'inset-x-0 bottom-0 h-80 animate-slide-in-bottom',
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />
            {/* Sheet panel */}
            <div
                className={cn(
                    'fixed z-50 bg-white shadow-xl p-6 overflow-y-auto',
                    sideClasses[side],
                    className
                )}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </>
    )
}

function SheetHeader({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn('flex flex-col space-y-2 mb-4', className)}>
            {children}
        </div>
    )
}

function SheetTitle({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <h2 className={cn('text-lg font-bold', className)}>{children}</h2>
    )
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }
