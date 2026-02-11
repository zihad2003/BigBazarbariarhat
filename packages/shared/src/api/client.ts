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

export const fetchHandler = async (url: string, options: RequestInit = {}) => {
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
