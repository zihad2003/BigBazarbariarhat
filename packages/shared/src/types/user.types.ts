export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'STAFF';

export interface User {
    id: string;
    email: string;
    phone?: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    avatar?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Customer extends User {
    orderCount: number;
    totalSpent: number;
}

export interface Address {
    id: string;
    userId: string;
    label: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserFilters {
    role?: UserRole;
    isActive?: boolean;
    search?: string;
}
