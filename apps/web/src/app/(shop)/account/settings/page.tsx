'use client';

import { useState } from 'react';
import { User, Lock, Bell, Shield, Check, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useUIStore } from '@/lib/stores/ui-store';
import { AnimatePresence, motion } from 'framer-motion';

type TabType = 'profile' | 'security' | 'notifications' | 'privacy';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const user = session?.user as any;
    const isLoaded = status !== 'loading';
    const { addNotification } = useUIStore();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isUpdating, setIsUpdating] = useState(false);

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');

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

    if (!isLoaded) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            </div>
        );
    }

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'profile', label: 'Personal Details', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Preferences', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Settings</h1>
                <p className="text-neutral-400 text-sm font-medium mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Settings Navigation */}
                <nav className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-left ${
                                activeTab === tab.id 
                                    ? 'bg-neutral-900 text-white' 
                                    : 'bg-neutral-50 text-neutral-400 hover:text-neutral-900 hover:bg-white border border-neutral-100'
                            }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            <span className="font-bold text-xs uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Settings Content */}
                <div className="lg:col-span-8 bg-neutral-50 rounded-xl border border-neutral-100 p-6 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && (
                                <div className="max-w-lg">
                                    <h2 className="text-lg font-black text-neutral-900 mb-1">Personal Details</h2>
                                    <p className="text-neutral-400 text-sm font-medium mb-6">Update your name and view your account email.</p>

                                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">First Name</label>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all font-bold text-sm"
                                                    placeholder="First Name"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all font-bold text-sm"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email Address</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="w-full bg-neutral-100 border border-transparent rounded-xl px-4 py-3 text-neutral-400 cursor-not-allowed font-bold text-sm"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white text-emerald-500 px-3 py-1 rounded-lg text-[9px] font-bold uppercase border border-neutral-100">
                                                    <Check className="h-3 w-3" /> Verified
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-neutral-300 font-medium">Email is linked to your login provider.</p>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="h-10 px-8 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold uppercase tracking-widest text-[10px] disabled:opacity-50"
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Changes'}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="max-w-lg">
                                    <h2 className="text-lg font-black text-neutral-900 mb-1">Change Password</h2>
                                    <p className="text-neutral-400 text-sm font-medium mb-6">Update your account password to keep it secure.</p>

                                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                                        {[
                                            { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, placeholder: 'Enter current password' },
                                            { label: 'New Password', value: newPassword, setter: setNewPassword, placeholder: 'Enter new password' },
                                            { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Re-enter new password' },
                                        ].map((field, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{field.label}</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords ? 'text' : 'password'}
                                                        value={field.value}
                                                        onChange={(e) => field.setter(e.target.value)}
                                                        className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all font-bold text-sm pr-12"
                                                        placeholder={field.placeholder}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(!showPasswords)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-900 transition-colors"
                                                    >
                                                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="h-10 px-8 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold uppercase tracking-widest text-[10px] disabled:opacity-50"
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Update Password'}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="flex flex-col items-center justify-center text-center py-16">
                                    <Bell className="h-8 w-8 text-neutral-200 mb-4" />
                                    <h3 className="text-lg font-black text-neutral-900 mb-2">Notification Preferences</h3>
                                    <p className="text-neutral-400 text-sm font-medium max-w-xs">Manage your email and push notification settings. Coming soon.</p>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="flex flex-col items-center justify-center text-center py-16">
                                    <Shield className="h-8 w-8 text-neutral-200 mb-4" />
                                    <h3 className="text-lg font-black text-neutral-900 mb-2">Privacy Settings</h3>
                                    <p className="text-neutral-400 text-sm font-medium max-w-xs">Control your data sharing and privacy preferences. Coming soon.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
