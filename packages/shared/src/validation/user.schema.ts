import { z } from 'zod';

export const userRoleSchema = z.enum(['CUSTOMER', 'ADMIN', 'SUPER_ADMIN', 'STAFF']);

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    avatar: z.string().url().optional(),
});

export const addressSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('Bangladesh'),
    isDefault: z.boolean().default(false),
});
