'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    Edit3,
    Mail,
    MapPin,
    Package,
    Phone,
    ShoppingBag,
    Star,
    Trash2,
    TrendingUp,
    User as UserIcon,
    Plus as PlusIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomersService, Customer } from '@bigbazar/shared';

export default function CustomerDetailPage() {
    const params = useParams() as { id: string };
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCustomer = async () => {
            const id = params?.id as string;
            if (!id) return;
            try {
                const response = await CustomersService.getCustomerById(id);
                if (response.success && response.data) {
                    setCustomer(response.data);
                } else {
                    router.push('/admin/customers');
                }
            } catch (error) {
                console.error('Failed to fetch associate:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [params?.id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/customers">
                    <Button variant="ghost" className="p-2 h-12 w-12 rounded-xl hover:bg-gray-100">
                        <ArrowLeft className="h-6 w-6 text-gray-500" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">Associate Profile</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Identity: #{customer.id.slice(-8)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-indigo-50" />
                        <div className="relative z-10 flex flex-col items-center mt-12">
                            <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-xl mb-6">
                                <div className="w-full h-full bg-indigo-100 rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                                    {customer.avatar ? (
                                        <img src={customer.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-12 w-12 text-indigo-400" />
                                    )}
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center">{customer.firstName} {customer.lastName}</h2>
                            <div className="flex gap-2 mt-3">
                                <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[9px]">
                                    {customer.role}
                                </Badge>
                                <Badge className={customer.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest text-[9px]" : "bg-rose-50 text-rose-600 border-rose-100 uppercase tracking-widest text-[9px]"}>
                                    {customer.isActive ? 'Active Status' : 'Inactive'}
                                </Badge>
                            </div>

                            <div className="w-full mt-8 space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-gray-900 truncate">{customer.email}</p>
                                    </div>
                                    {customer.emailVerified && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />}
                                </div>

                                {customer.phone && (
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Number</p>
                                            <p className="font-bold text-gray-900">{customer.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                <Button className="h-14 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                    <Edit3 className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" className="h-14 border-2 border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                                    <Trash2 className="h-4 w-4 mr-2" /> Block
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black italic tracking-tighter">Engagement Score</h3>
                            <TrendingUp className="h-6 w-6 opacity-80" />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Lifetime Value</p>
                                <p className="text-3xl font-black tracking-tighter">৳{(customer.totalSpent || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Total Orders</p>
                                <p className="text-3xl font-black tracking-tighter">{customer.orderCount || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity & Orders */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Orders - Placeholder for now, requires fetching orders logic */}
                    <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Recent Manifests</h3>
                            <Button variant="ghost" className="text-indigo-600 font-bold text-xs uppercase tracking-widest">View All History</Button>
                        </div>

                        <div className="space-y-4">
                            {/* Assuming orders are populated or we fetch them separately. For now showing empty state or static if not in customer object */}
                            {(!customer.orderCount || customer.orderCount === 0) ? (
                                <div className="text-center py-12 bg-gray-50 rounded-[2rem]">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transaction history recorded</p>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-[2rem]">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Order history visualization coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Registered Coordinates</h3>
                            <Button variant="outline" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-2">
                                <PlusIcon className="h-3 w-3 mr-2" /> Add New
                            </Button>
                        </div>

                        {/* Assuming addresses are populated or we fetch them separately */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-black transition-all group cursor-pointer relative">
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit3 className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <MapPin className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-900">Primary Residence</span>
                                </div>
                                <p className="text-gray-600 text-sm font-bold leading-relaxed">
                                    No address data loaded.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
