'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Lock,
    Shield,
    Loader2,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const customerSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    avatar: z.string().url('Invalid image URL').optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['CUSTOMER', 'STAFF', 'ADMIN']).default('CUSTOMER'),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function NewCustomerPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            role: 'CUSTOMER',
        }
    });

    const onSubmit = async (data: CustomerFormValues) => {
        setSaving(true);
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                router.push('/customers');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="flex items-center gap-6 border-b border-gray-100 pb-10">
                <button
                    onClick={() => router.back()}
                    className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Integrate Associate</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Direct Registration Pipeline</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-[10rem] opacity-30" />
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <User className="h-5 w-5 text-indigo-600" />
                        Identity Profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Given Name</label>
                            <input
                                {...register('firstName')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="John"
                            />
                            {errors.firstName && <p className="text-rose-500 text-xs ml-4">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Family Name</label>
                            <input
                                {...register('lastName')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="Doe"
                            />
                            {errors.lastName && <p className="text-rose-500 text-xs ml-4">{errors.lastName.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Communication Node (Email)</label>
                            <input
                                {...register('email')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-rose-500 text-xs ml-4">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mobile Link (Optional)</label>
                            <input
                                {...register('phone')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="+8801..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Avatar Manifest URL (Optional)</label>
                            <input
                                {...register('avatar')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                placeholder="https://..."
                            />
                            {errors.avatar && <p className="text-rose-500 text-xs ml-4">{errors.avatar.message}</p>}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                        <Shield className="h-5 w-5 text-rose-500" />
                        Access Credentials
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Security Phrase (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-rose-500 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-rose-500 text-xs ml-4">{errors.password.message}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">System Privilege</label>
                            <select
                                {...register('role')}
                                className="w-full h-16 px-6 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none appearance-none"
                            >
                                <option value="CUSTOMER">Customer Associate</option>
                                <option value="STAFF">Operational Staff</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4 p-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="h-16 px-10 border-2 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px]"
                    >
                        Abort Registration
                    </Button>
                    <Button
                        disabled={saving}
                        className="h-16 px-12 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Sparkles className="h-5 w-5 mr-3" />}
                        {saving ? 'Encrypting...' : 'Authorize Integration'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
