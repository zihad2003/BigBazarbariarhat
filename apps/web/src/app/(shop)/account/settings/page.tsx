'use client';

import { useState } from 'react';
import { Settings, User, Lock, Bell, Shield, ArrowLeft, Check, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useUIStore } from '@/lib/stores/ui-store';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'profile' | 'security' | 'notifications' | 'privacy';

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const { addNotification } = useUIStore();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isUpdating, setIsUpdating] = useState(false);

    // Profile state
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsUpdating(true);
        try {
            await user.update({ firstName, lastName });
            addNotification({ type: 'success', message: 'Profile updated successfully' });
        } catch (error: any) {
            addNotification({ type: 'error', message: error.errors?.[0]?.message || 'Update failed' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (newPassword !== confirmPassword) {
            addNotification({ type: 'error', message: 'Passwords do not match' });
            return;
        }
        setIsUpdating(true);
        try {
            await user.updatePassword({ currentPassword, newPassword });
            addNotification({ type: 'success', message: 'Password changed successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            addNotification({ type: 'error', message: error.errors?.[0]?.message || 'Failed to change password' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isLoaded) return <div className="h-[70vh] flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-black" /></div>;

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'profile', label: 'Personal Details', icon: User },
        { id: 'security', label: 'Security & Access', icon: Lock },
        { id: 'notifications', label: 'Preferences', icon: Bell },
        { id: 'privacy', label: 'Privacy Control', icon: Shield },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <Link href="/account" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors mb-6 uppercase tracking-[0.2em] group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                    Settings <Settings className="h-10 w-10 text-gray-100" />
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Settings Navigation */}
                <nav className="lg:col-span-4 space-y-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] transition-all relative group ${activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <tab.icon className={`h-6 w-6 ${activeTab === tab.id ? 'text-black' : 'text-gray-300'}`} />
                                <span className={`font-black text-lg uppercase tracking-tight ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
                            </div>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-white border border-gray-100 shadow-xl shadow-black/5 rounded-[2.5rem]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {activeTab === tab.id && <div className="w-2 h-2 rounded-full bg-black relative z-10" />}
                        </button>
                    ))}
                </nav>

                {/* Settings Form Area */}
                <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-gray-100 p-8 lg:p-12 shadow-sm min-h-[600px] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'profile' && (
                                <div className="max-w-2xl">
                                    <div className="mb-12">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">Identity Module</h3>
                                        <h2 className="text-4xl font-black text-gray-900 mb-4">Personal Details</h2>
                                        <p className="text-gray-400 font-medium text-lg">Synchronize your profile details across our ecosystem.</p>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-bold text-lg"
                                                    placeholder="First Name"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-bold text-lg"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Authentication Email</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={user?.emailAddresses[0].emailAddress}
                                                    disabled
                                                    className="w-full bg-gray-100 border border-transparent rounded-[2rem] p-6 text-gray-400 cursor-not-allowed font-bold"
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-gray-100 shadow-sm">
                                                    <Check className="h-3 w-3" />
                                                    Verified
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tight ml-1">Email is managed via your primary authentication provider.</p>
                                        </div>

                                        <div className="pt-6">
                                            <Button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="h-20 px-12 bg-black text-white hover:bg-gray-800 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-black/20 transition-transform active:scale-95 disabled:opacity-50 min-w-[240px]"
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin h-6 w-6" /> : 'Synchronize Identity'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="max-w-2xl">
                                    <div className="mb-12">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4">Defense Protocols</h3>
                                        <h2 className="text-4xl font-black text-gray-900 mb-4">Vault Access</h2>
                                        <p className="text-gray-400 font-medium text-lg">Modify your vault's authentication cipher.</p>
                                    </div>

                                    <form onSubmit={handleUpdatePassword} className="space-y-8">
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Existing Cipher', value: currentPassword, setter: setCurrentPassword, placeholder: 'Verify current cipher' },
                                                { label: 'Intended Cipher', value: newPassword, setter: setNewPassword, placeholder: 'Establish new unique cipher' },
                                                { label: 'Confirm Cipher', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Re-enter intended cipher' },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{field.label}</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPasswords ? 'text' : 'password'}
                                                            value={field.value}
                                                            onChange={(e) => field.setter(e.target.value)}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-bold pr-16 text-lg"
                                                            placeholder={field.placeholder}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords(!showPasswords)}
                                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                                                        >
                                                            {showPasswords ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-8">
                                            <Button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="h-20 px-12 bg-black text-white hover:bg-gray-800 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-black/20 transition-transform active:scale-95 disabled:opacity-50 min-w-[240px]"
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin h-6 w-6" /> : 'Reinforce Vault'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="h-full flex flex-col items-center justify-center text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl text-gray-200">
                                        <Bell className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-4">Protocol Preferences</h3>
                                    <p className="text-gray-400 font-medium max-w-sm px-6 text-lg">Advanced communication control panel is currently undergoing authorization tests.</p>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="h-full flex flex-col items-center justify-center text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl text-gray-200">
                                        <Shield className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-4">Privacy Cloak</h3>
                                    <p className="text-gray-400 font-medium max-w-sm px-6 text-lg">Granular data concealment tools are being integrated into the main grid.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
