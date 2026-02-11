export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message?: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface DashboardStats {
    totalSales: {
        today: number;
        thisMonth: number;
        allTime: number;
    };
    totalOrders: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        total: number;
    };
    totalCustomers: number;
    totalProducts: number;
    lowStockItems: number;
    pendingReviews: number;
}
