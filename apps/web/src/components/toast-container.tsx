'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';

/**
 * Toast notification types with corresponding styles and icons.
 */
const toastConfig = {
    success: {
        icon: CheckCircle,
        bg: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-800',
        progressColor: 'bg-emerald-400',
    },
    error: {
        icon: XCircle,
        bg: 'bg-rose-50 border-rose-200',
        iconColor: 'text-rose-500',
        textColor: 'text-rose-800',
        progressColor: 'bg-rose-400',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-500',
        textColor: 'text-amber-800',
        progressColor: 'bg-amber-400',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-800',
        progressColor: 'bg-blue-400',
    },
} as const;

/**
 * Individual Toast item component with enter/exit animations and auto-dismiss timer.
 */
function ToastItem({
    notification,
    onDismiss,
}: {
    notification: {
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        title?: string;
        duration?: number;
    };
    onDismiss: (id: string) => void;
}) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const config = toastConfig[notification.type];
    const Icon = config.icon;
    const duration = notification.duration ?? 5000;

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                handleDismiss();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(notification.id), 300);
    };

    return (
        <div
            className={`
                relative overflow-hidden rounded-2xl border p-4 shadow-lg backdrop-blur-sm
                ${config.bg}
                transition-all duration-300 ease-out
                ${isExiting
                    ? 'translate-x-full opacity-0 scale-95'
                    : 'translate-x-0 opacity-100 scale-100'
                }
                animate-in slide-in-from-right-full
            `}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    {notification.title && (
                        <p className={`text-sm font-black uppercase tracking-wider mb-0.5 ${config.textColor}`}>
                            {notification.title}
                        </p>
                    )}
                    <p className={`text-sm font-bold ${config.textColor}`}>
                        {notification.message}
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors ${config.textColor}`}
                    aria-label="Dismiss notification"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                <div
                    className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

/**
 * Global Toast container.
 * Renders all active notifications from the UI store.
 * Place this once in your root layout.
 *
 * Usage in layout.tsx:
 * ```tsx
 * <ToastContainer />
 * ```
 *
 * Trigger from anywhere:
 * ```tsx
 * const { addNotification } = useUIStore();
 * addNotification({ type: 'success', message: 'Saved!' });
 * ```
 */
export function ToastContainer() {
    const notifications = useUIStore((state) => state.notifications);
    const removeNotification = useUIStore((state) => state.removeNotification);

    if (notifications.length === 0) return null;

    return (
        <div
            className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
            aria-label="Notifications"
        >
            {notifications.map((notification) => (
                <div key={notification.id} className="pointer-events-auto">
                    <ToastItem
                        notification={notification}
                        onDismiss={removeNotification}
                    />
                </div>
            ))}
        </div>
    );
}

export default ToastContainer;
