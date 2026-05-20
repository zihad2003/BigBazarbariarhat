'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetContextValue {
    open: boolean
    setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

export function useSheet() {
    const context = React.useContext(SheetContext)
    if (!context) {
        throw new Error('useSheet must be used within a Sheet')
    }
    return context
}

interface SheetProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

function Sheet({ children, open: controlledOpen, onOpenChange: controlledOnOpenChange }: SheetProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
    const setOpen = controlledOnOpenChange || setUncontrolledOpen

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
    const { setOpen } = useSheet()

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
    const { open, setOpen } = useSheet()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    React.useEffect(() => {
        if (open) {
            const originalStyle = window.getComputedStyle(document.body).overflow
            document.body.style.overflow = 'hidden'
            document.body.classList.add('drawer-open')
            return () => {
                document.body.style.overflow = originalStyle
                document.body.classList.remove('drawer-open')
            }
        }
    }, [open])

    if (!open) return null
    if (!mounted) return null

    const sideClasses = {
        left: 'inset-y-0 left-0 w-80 animate-slide-in-left',
        right: 'inset-y-0 right-0 w-80 animate-slide-in-right',
        top: 'inset-x-0 top-0 h-80 animate-slide-in-top',
        bottom: 'inset-x-0 bottom-0 h-80 animate-slide-in-bottom',
    }

    const content = (
        <div className="fixed inset-0 z-[1000]">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]"
                onClick={() => setOpen(false)}
            />
            {/* Sheet panel */}
            <div
                className={cn(
                    'fixed bg-white shadow-xl p-6 overflow-y-auto',
                    sideClasses[side],
                    className,
                    'z-[1002]'
                )}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity z-[1003]"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>
    )

    return createPortal(content, document.body)
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
