export class ApiError extends Error {
    constructor(
        public message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const fetchHandler = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(data.message || 'An error occurred', response.status, data);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(error instanceof Error ? error.message : 'Network error', 500);
    }
};

export const ApiClient = {
    get: <T>(url: string, options?: RequestInit): Promise<T> =>
        fetchHandler<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, body?: any, options?: RequestInit): Promise<T> =>
        fetchHandler<T>(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        }),

    put: <T>(url: string, body?: any, options?: RequestInit): Promise<T> =>
        fetchHandler<T>(url, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        }),

    patch: <T>(url: string, body?: any, options?: RequestInit): Promise<T> =>
        fetchHandler<T>(url, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined
        }),

    delete: <T>(url: string, options?: RequestInit): Promise<T> =>
        fetchHandler<T>(url, { ...options, method: 'DELETE' }),
};
