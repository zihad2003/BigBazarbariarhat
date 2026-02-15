'use client';

import {
    Settings,
    User,
    Lock,
    Bell,
    Shield,
    ArrowLeft,
    Check
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
    const { user } = useUser();

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4 uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Account Settings</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Settings Navigation */}
                <nav className="lg:col-span-4 space-y-2">
                    {[
                        { label: 'Profile Information', icon: User, active: true },
                        { label: 'Security & Password', icon: Lock, active: false },
                        { label: 'Notifications', icon: Bell, active: false },
                        { label: 'Privacy & Data', icon: Shield, active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all ${item.active ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className="h-6 w-6" />
                                <span className="font-bold text-lg">{item.label}</span>
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Settings Form Area */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 p-12 shadow-sm">
                    <div className="space-y-12">
                        {/* Profile Image Section */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Profile Picture</h3>
                            <div className="flex items-center gap-8">
                                <div className="w-32 h-32 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-5xl font-black relative overflow-hidden group">
                                    {user?.firstName?.charAt(0) || 'U'}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Settings className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex gap-4 mb-4">
                                        <Button className="bg-black text-white rounded-xl h-12 px-6 font-bold">Upload New</Button>
                                        <Button variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl h-12 px-6 font-bold">Remove</Button>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">Recommended: Square image, at least 400x400px. JPG or PNG.</p>
                                </div>
                            </div>
                        </section>

                        {/* Personal Details Section */}
                        <section className="space-y-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-600 px-1">First Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.firstName || ''}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:bg-white focus:border-gray-200 font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-600 px-1">Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.lastName || ''}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:bg-white focus:border-gray-200 font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-600 px-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            disabled
                                            defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                                            className="w-full px-6 py-4 bg-gray-100 border border-transparent rounded-[1.5rem] text-gray-400 font-bold cursor-not-allowed"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                            <Check className="h-3 w-3" />
                                            Verified
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-600 px-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+880 1XXX-XXXXXX"
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:bg-white focus:border-gray-200 font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-600 px-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:outline-none focus:bg-white focus:border-gray-200 font-bold transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Save Actions */}
                        <div className="flex justify-end gap-4 pt-8 border-t border-gray-50">
                            <Button variant="ghost" className="rounded-2xl h-14 px-10 font-black text-lg">Discard Changes</Button>
                            <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl h-14 px-12 font-black text-lg shadow-xl shadow-black/20">Save Profile</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
