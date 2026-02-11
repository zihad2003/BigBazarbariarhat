'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

/**
 * Props for the ErrorBoundary component.
 * @property {React.ReactNode} children - Child components to wrap.
 * @property {React.ReactNode} [fallback] - Optional custom fallback UI.
 * @property {(error: Error, errorInfo: React.ErrorInfo) => void} [onError] - Error callback.
 */
interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Global Error Boundary component.
 *
 * Catches JavaScript errors anywhere in its child component tree,
 * logs them, and displays a premium fallback UI instead of crashing.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary onError={(err) => trackError(err)}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({ errorInfo });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[ErrorBoundary] Caught error:', error);
            console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
        }

        // Call external error handler (e.g., Sentry)
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
        }

        return this.props.children;
    }
}

/**
 * Default premium error fallback UI.
 * Shows error details in development and a user-friendly message in production.
 */
function ErrorFallback({
    error,
    onReset,
}: {
    error: Error | null;
    onReset: () => void;
}) {
    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="max-w-lg w-full">
                {/* Error Icon */}
                <div className="relative mx-auto w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-[2rem] blur-xl animate-pulse" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-rose-50 to-orange-50 rounded-[2rem] flex items-center justify-center border border-rose-100/50">
                        <AlertTriangle className="h-10 w-10 text-rose-500" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-black text-center text-gray-900 tracking-tight mb-3">
                    Something went wrong
                </h2>
                <p className="text-center text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                    We encountered an unexpected error. Please try again or return to the homepage.
                </p>

                {/* Dev Error Details */}
                {isDev && error && (
                    <div className="mb-8 p-5 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                            <Bug className="h-4 w-4 text-rose-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                                Dev Error Details
                            </span>
                        </div>
                        <p className="text-rose-300 font-mono text-sm mb-2">{error.name}: {error.message}</p>
                        {error.stack && (
                            <pre className="text-gray-400 text-xs font-mono overflow-x-auto max-h-32 scrollbar-thin">
                                {error.stack.split('\n').slice(1, 5).join('\n')}
                            </pre>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={onReset}
                        className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ErrorBoundary;
