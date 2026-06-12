'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    Award, 
    ShieldCheck, 
    Camera,
    Lock,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status !== 'loading' && (!session || !session?.user)) {
            router.push('/login?callbackUrl=/account/profile');
        }
    }, [status, session, router]);

    const orderCount = MOCK_ORDERS.length;
    const tier = orderCount >= 10 ? 'Gold' : orderCount >= 5 ? 'Silver' : 'Regular';
    const tierColors = {
        Gold: 'bg-amber-50 text-amber-600 border-amber-100',
        Silver: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        Regular: 'bg-blue-50 text-blue-600 border-blue-100'
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsEditing(false);
        setIsLoading(false);
    };

    if (status === 'loading') {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-900" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Personal Profile</h1>
                <p className="text-neutral-400 text-sm font-medium mt-1">View and update your account information.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* Profile Card */}
                <section className="xl:col-span-4">
                    <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <div className="w-full h-full rounded-xl bg-neutral-900 flex items-center justify-center text-white text-2xl font-black overflow-hidden">
                                {session?.user?.image ? (
                                    <img src={session?.user?.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    session?.user?.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-neutral-400 border border-neutral-100 hover:text-neutral-900 transition-colors">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        
                        <h2 className="text-lg font-black text-neutral-900 tracking-tight uppercase mb-1">{session?.user?.name || 'Customer'}</h2>
                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border mb-6", tierColors[tier])}>
                            <Award className="h-3 w-3" />
                            {tier} Member
                        </div>

                        <div className="space-y-3 pt-4 border-t border-neutral-100 text-left">
                            <div className="flex items-center gap-3 text-neutral-400">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="text-[11px] font-medium break-all">{session?.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span className="text-[11px] font-medium">+880 1712-345678</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span className="text-[11px] font-medium">Joined April 2026</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Edit Form */}
                <section className="xl:col-span-8">
                    <div className="bg-neutral-50 rounded-xl p-6 lg:p-8 border border-neutral-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight">Personal Details</h3>
                            {!isEditing && (
                                <Button 
                                    onClick={() => setIsEditing(true)}
                                    variant="outline" 
                                    className="rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest border-neutral-200 bg-white"
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Full Name</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        defaultValue={session?.user?.name || ''}
                                        className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email Address</label>
                                    <input 
                                        type="email"
                                        disabled={true}
                                        defaultValue={session?.user?.email || ''}
                                        className="w-full px-4 py-3 bg-neutral-100 border border-transparent rounded-xl text-sm font-bold opacity-50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Phone Number</label>
                                    <input 
                                        type="tel"
                                        disabled={!isEditing}
                                        defaultValue="+880 1712-345678"
                                        className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Preferred Language</label>
                                    <select 
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all text-sm font-bold appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option>ENGLISH (US)</option>
                                        <option>BENGALI (BD)</option>
                                    </select>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-4 flex items-center gap-3">
                                    <Button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="rounded-xl h-11 px-8 bg-neutral-900 text-white hover:bg-neutral-800 transition-all font-bold text-[10px] uppercase tracking-widest"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                                    </Button>
                                    <Button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        variant="ghost" 
                                        className="rounded-xl h-11 px-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </form>

                        {/* Security Section */}
                        <div className="mt-8 pt-6 border-t border-neutral-100">
                            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Password & Security</h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-100 flex-1">
                                    <div className="flex items-center gap-3">
                                        <Lock className="h-4 w-4 text-neutral-400" />
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">Account Password</p>
                                            <p className="text-[9px] text-neutral-400 font-medium">Last updated 3 months ago</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="rounded-xl h-8 text-[9px] font-bold uppercase tracking-widest border-neutral-200 bg-white shrink-0">
                                        Update
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-100 flex-1">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4 text-neutral-400" />
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">Two-Factor (2FA)</p>
                                            <p className="text-[9px] text-neutral-400 font-medium">Currently Inactive</p>
                                        </div>
                                    </div>
                                    <Button className="rounded-xl h-8 text-[9px] font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800 shrink-0">
                                        Enable
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
