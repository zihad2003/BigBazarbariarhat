'use client';

import { Loader2, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger',
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            iconBg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
            buttonBg: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        },
        warning: {
            iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
            buttonBg: 'bg-amber-600 text-white hover:bg-amber-700',
        },
        info: {
            iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            buttonBg: 'bg-primary text-primary-foreground hover:bg-primary/90',
        },
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fade-in"
                onClick={isLoading ? undefined : onClose}
            />
            
            {/* Dialog Card */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all duration-300 ease-out transform scale-100 animate-in fade-in zoom-in-95">
                <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variantStyles[variant].iconBg}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground tracking-tight leading-none">{title}</h3>
                        <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-6">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-border text-[13px] font-medium hover:bg-muted/60 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50 ${variantStyles[variant].buttonBg}`}
                    >
                        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
