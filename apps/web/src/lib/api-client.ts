/**
 * API Client with retry logic, error handling, and request/response interceptors.
 *
 * Features:
 * - Automatic retry with exponential backoff for transient errors
 * - Configurable timeout
 * - Request/response interceptors
 * - Type-safe responses
 * - Consistent error formatting
 *
 * @example
 * ```ts
 * const data = await apiClient.get<Product[]>('/api/products', { limit: 10 });
 * const order = await apiClient.post<Order>('/api/orders', orderData);
 * ```
 */

interface ApiClientConfig {
    /** Base URL for all requests. Defaults to window.location.origin. */
    baseUrl?: string;
    /** Default timeout in milliseconds. Defaults to 10000 (10s). */
    timeout?: number;
    /** Max number of retry attempts for failed requests. Defaults to 3. */
    maxRetries?: number;
    /** Base delay in ms between retry attempts (doubles each retry). Defaults to 1000. */
    retryDelay?: number;
    /** HTTP status codes that should trigger a retry. Defaults to [408, 429, 500, 502, 503, 504]. */
    retryableStatuses?: number[];
}

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
    success: boolean;
}

type RequestInterceptor = (config: RequestInit) => RequestInit;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const DEFAULT_CONFIG: Required<ApiClientConfig> = {
    baseUrl: '',
    timeout: 10000,
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
};

class ApiClient {
    private config: Required<ApiClientConfig>;
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];

    constructor(config: ApiClientConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Add a request interceptor (e.g., for adding auth headers).
     */
    addRequestInterceptor(interceptor: RequestInterceptor): void {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Add a response interceptor (e.g., for token refresh).
     */
    addResponseInterceptor(interceptor: ResponseInterceptor): void {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * Perform a GET request.
     */
    async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        const queryString = params
            ? '?' + new URLSearchParams(
                Object.entries(params)
                    .filter(([, v]) => v !== undefined && v !== null)
                    .map(([k, v]) => [k, String(v)]),
            ).toString()
            : '';

        return this.request<T>(`${url}${queryString}`, { method: 'GET' });
    }

    /**
     * Perform a POST request.
     */
    async post<T>(url: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * Perform a PUT request.
     */
    async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * Perform a PATCH request.
     */
    async patch<T>(url: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * Perform a DELETE request.
     */
    async delete<T>(url: string): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'DELETE' });
    }

    /**
     * Core request method with retry logic and error handling.
     */
    private async request<T>(
        url: string,
        init: RequestInit,
        attempt: number = 0,
    ): Promise<ApiResponse<T>> {
        // Apply request interceptors
        let config = { ...init };
        for (const interceptor of this.requestInterceptors) {
            config = interceptor(config);
        }

        const fullUrl = `${this.config.baseUrl}${url}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            let response = await fetch(fullUrl, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Apply response interceptors
            for (const interceptor of this.responseInterceptors) {
                response = await interceptor(response);
            }

            // Handle retryable errors
            if (
                !response.ok &&
                this.config.retryableStatuses.includes(response.status) &&
                attempt < this.config.maxRetries
            ) {
                const delay = this.config.retryDelay * Math.pow(2, attempt);
                console.warn(
                    `[ApiClient] Request failed with ${response.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${this.config.maxRetries})`,
                );
                await this.sleep(delay);
                return this.request<T>(url, init, attempt + 1);
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            let data: T | null = null;

            if (contentType?.includes('application/json')) {
                const json = await response.json();
                data = json.data ?? json;
            }

            if (!response.ok) {
                const errorMessage = (data as any)?.error
                    || (data as any)?.message
                    || `HTTP ${response.status}: ${response.statusText}`;

                return {
                    data: null,
                    error: errorMessage,
                    status: response.status,
                    success: false,
                };
            }

            return {
                data,
                error: null,
                status: response.status,
                success: true,
            };
        } catch (err: any) {
            clearTimeout(timeoutId);

            // Handle timeout
            if (err.name === 'AbortError') {
                if (attempt < this.config.maxRetries) {
                    const delay = this.config.retryDelay * Math.pow(2, attempt);
                    console.warn(`[ApiClient] Request timed out, retrying in ${delay}ms`);
                    await this.sleep(delay);
                    return this.request<T>(url, init, attempt + 1);
                }
                return {
                    data: null,
                    error: 'Request timed out. Please check your connection and try again.',
                    status: 408,
                    success: false,
                };
            }

            // Handle network errors
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                if (attempt < this.config.maxRetries) {
                    const delay = this.config.retryDelay * Math.pow(2, attempt);
                    console.warn(`[ApiClient] Network error, retrying in ${delay}ms`);
                    await this.sleep(delay);
                    return this.request<T>(url, init, attempt + 1);
                }
                return {
                    data: null,
                    error: 'Network error. Please check your internet connection.',
                    status: 0,
                    success: false,
                };
            }

            return {
                data: null,
                error: err.message || 'An unexpected error occurred.',
                status: 500,
                success: false,
            };
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Singleton instance
export const apiClient = new ApiClient();

export { ApiClient };
export type { ApiClientConfig, ApiResponse };
