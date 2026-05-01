'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const addressSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('Bangladesh'),
    isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
    initialData?: AddressFormData;
    onSubmit: (data: AddressFormData) => Promise<void>;
    isLoading?: boolean;
    buttonLabel?: string;
    onCancel?: () => void;
}

export function AddressForm({ initialData, onSubmit, isLoading, buttonLabel = 'Save Address', onCancel }: AddressFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: initialData || {
            country: 'Bangladesh',
            isDefault: false
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="label" className="text-sm font-bold uppercase tracking-wider text-gray-500">Label (e.g. Home, Office)</label>
                    <Input id="label" {...register('label')} placeholder="Home" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
                    {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                    <Input id="fullName" {...register('fullName')} placeholder="John Doe" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                <Input id="phone" {...register('phone')} placeholder="+880 1712-345678" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="addressLine1" className="text-sm font-bold uppercase tracking-wider text-gray-500">Address Line 1</label>
                <Input id="addressLine1" {...register('addressLine1')} placeholder="House 123, Road 4" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
                {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="addressLine2" className="text-sm font-bold uppercase tracking-wider text-gray-500">Address Line 2 (Optional)</label>
                <Input id="addressLine2" {...register('addressLine2')} placeholder="Apartment, Studio, or Floor" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-bold uppercase tracking-wider text-gray-500">City</label>
                    <Input id="city" {...register('city')} placeholder="Dhaka" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-bold uppercase tracking-wider text-gray-500">State / Region</label>
                    <Input id="state" {...register('state')} placeholder="Dhaka" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-sm font-bold uppercase tracking-wider text-gray-500">Postal Code</label>
                    <Input id="postalCode" {...register('postalCode')} placeholder="1216" disabled={isLoading} className="h-12 bg-gray-50 border-gray-200 focus:border-black focus:ring-black" />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
                <input
                    type="checkbox"
                    id="isDefault"
                    {...register('isDefault')}
                    className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="isDefault" className="text-sm font-bold text-gray-700 select-none cursor-pointer">Set as default address</label>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="h-12 px-8 uppercase tracking-widest font-bold">
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isLoading} className="h-12 px-8 bg-black text-white hover:bg-gray-800 uppercase tracking-widest font-bold">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {buttonLabel}
                </Button>
            </div>
        </form>
    );
}
