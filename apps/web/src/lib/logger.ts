/**
 * Lightweight logging service for the application.
 *
 * Provides structured logging with levels, timestamps, and context.
 * In production, logs at 'warn' and above. In development, logs everything.
 *
 * Can be extended to send logs to external services (Sentry, LogRocket, etc.)
 *
 * @example
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Payment failed', { orderId: 'ord-1', error: err });
 * logger.warn('Low stock', { productId: 'prod-1', remaining: 2 });
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
    error?: Error;
}

type LogTransport = (entry: LogEntry) => void;

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
};

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
    debug: '#6b7280',
    info: '#3b82f6',
    warn: '#f59e0b',
    error: '#ef4444',
    fatal: '#dc2626',
};

class Logger {
    private minLevel: LogLevel;
    private transports: LogTransport[] = [];
    private context: Record<string, any> = {};

    constructor() {
        this.minLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

        // Default console transport
        this.transports.push(this.consoleTransport);
    }

    /**
     * Set the minimum log level.
     */
    setLevel(level: LogLevel): void {
        this.minLevel = level;
    }

    /**
     * Add persistent context to all log entries (e.g., userId, sessionId).
     */
    setContext(ctx: Record<string, any>): void {
        this.context = { ...this.context, ...ctx };
    }

    /**
     * Add a custom transport for sending logs to external services.
     */
    addTransport(transport: LogTransport): void {
        this.transports.push(transport);
    }

    /** Log at debug level. */
    debug(message: string, context?: Record<string, any>): void {
        this.log('debug', message, context);
    }

    /** Log at info level. */
    info(message: string, context?: Record<string, any>): void {
        this.log('info', message, context);
    }

    /** Log at warn level. */
    warn(message: string, context?: Record<string, any>): void {
        this.log('warn', message, context);
    }

    /** Log at error level with optional Error object. */
    error(message: string, context?: Record<string, any>, error?: Error): void {
        this.log('error', message, context, error);
    }

    /** Log at fatal level — critical failures. */
    fatal(message: string, context?: Record<string, any>, error?: Error): void {
        this.log('fatal', message, context, error);
    }

    /**
     * Create a child logger with additional context.
     * Useful for request-scoped or component-scoped logging.
     */
    child(childContext: Record<string, any>): Logger {
        const child = new Logger();
        child.context = { ...this.context, ...childContext };
        child.minLevel = this.minLevel;
        child.transports = [...this.transports];
        return child;
    }

    /**
     * Measure execution time of an async operation.
     */
    async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
        const start = performance.now();
        try {
            const result = await fn();
            const duration = Math.round(performance.now() - start);
            this.info(`${label} completed`, { durationMs: duration });
            return result;
        } catch (err) {
            const duration = Math.round(performance.now() - start);
            this.error(`${label} failed`, { durationMs: duration }, err as Error);
            throw err;
        }
    }

    private log(
        level: LogLevel,
        message: string,
        context?: Record<string, any>,
        error?: Error,
    ): void {
        if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minLevel]) {
            return;
        }

        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context: { ...this.context, ...context },
            error,
        };

        for (const transport of this.transports) {
            try {
                transport(entry);
            } catch {
                // Silently ignore transport errors
            }
        }
    }

    private consoleTransport = (entry: LogEntry): void => {
        const color = LOG_LEVEL_COLORS[entry.level];
        const prefix = `%c[${entry.level.toUpperCase()}]`;
        const timestamp = new Date(entry.timestamp).toLocaleTimeString();
        const ctx = entry.context && Object.keys(entry.context).length > 0
            ? entry.context
            : undefined;

        const args: any[] = [
            `${prefix} %c${timestamp} %c${entry.message}`,
            `color: ${color}; font-weight: bold`,
            'color: #9ca3af',
            'color: inherit',
        ];

        if (ctx) args.push(ctx);
        if (entry.error) args.push(entry.error);

        switch (entry.level) {
            case 'debug':
                console.debug(...args);
                break;
            case 'info':
                console.info(...args);
                break;
            case 'warn':
                console.warn(...args);
                break;
            case 'error':
            case 'fatal':
                console.error(...args);
                break;
        }
    };
}

/** Singleton logger instance. */
export const logger = new Logger();

export { Logger };
export type { LogLevel, LogEntry, LogTransport };
