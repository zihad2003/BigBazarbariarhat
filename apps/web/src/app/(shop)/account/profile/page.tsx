'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    Award, 
    ShieldCheck, 
    Camera,
    Lock,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const user = session?.user;
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate Member Tier
    const orderCount = MOCK_ORDERS.length;
    const tier = orderCount >= 10 ? 'Gold' : orderCount >= 5 ? 'Silver' : 'Regular';
    const tierColors = {
        Gold: 'bg-amber-100 text-amber-600 border-amber-200',
        Silver: 'bg-gray-100 text-gray-600 border-gray-200',
        Regular: 'bg-indigo-100 text-indigo-600 border-indigo-200'
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock Update
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsEditing(false);
        setIsLoading(false);
    };

    return (
        <div className="space-y-12">
            {/* Header Area */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Curator Identity</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Personal Profile</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                
                {/* Profile Card */}
                <section className="xl:col-span-4">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm text-center">
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="w-full h-full rounded-[2.5rem] bg-black flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-black/20 overflow-hidden border-4 border-white">
                                {user?.image ? (
                                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-lg border border-gray-50 hover:text-black transition-colors">
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">{user?.name || 'Anonymous Curator'}</h2>
                        <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-8", tierColors[tier])}>
                            <Award className="h-3 w-3" />
                            {tier} Tier Member
                        </div>

                        <div className="space-y-4 pt-8 border-t border-gray-50 text-left">
                            <div className="flex items-center gap-4 text-gray-400">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="text-[11px] font-bold tracking-tight truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span className="text-[11px] font-bold tracking-tight">+880 1712-345678</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span className="text-[11px] font-bold tracking-tight">Joined April 2026</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Edit Form */}
                <section className="xl:col-span-8">
                    <div className="bg-white rounded-[3rem] p-10 lg:p-12 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Identity Authentication</h3>
                            </div>
                            {!isEditing && (
                                <Button 
                                    onClick={() => setIsEditing(true)}
                                    variant="outline" 
                                    className="rounded-xl h-10 text-[9px] font-black uppercase tracking-widest border-gray-100"
                                >
                                    Modify Protocol
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Identification</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        defaultValue={user?.name || ''}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Sync Channel (Email)</label>
                                    <input 
                                        type="email"
                                        disabled={true} // Email usually fixed or needs separate verification
                                        defaultValue={user?.email || ''}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight opacity-50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Mobile Terminal</label>
                                    <input 
                                        type="tel"
                                        disabled={!isEditing}
                                        defaultValue="+880 1712-345678"
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Preferred Language</label>
                                    <select 
                                        disabled={!isEditing}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight appearance-none disabled:opacity-50"
                                    >
                                        <option>ENGLISH (US)</option>
                                        <option>BENGALI (BD)</option>
                                    </select>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-8 flex items-center gap-4">
                                    <Button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="rounded-2xl h-16 px-10 bg-black text-white hover:bg-gray-800 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/20"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Synchronize Identity'}
                                    </Button>
                                    <Button 
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        variant="ghost" 
                                        className="rounded-2xl h-16 px-10 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </form>

                        <div className="mt-16 pt-12 border-t border-gray-50">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Security Matrix</h4>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-2xl flex-1 w-full">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Authentication Key</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Last updated 3 months ago</p>
                                    </div>
                                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-black transition-colors">
                                        Update
                                    </button>
                                </div>
                                <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-2xl flex-1 w-full">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Two-Factor Protocol</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Currently Inactive</p>
                                    </div>
                                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-black transition-colors">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
