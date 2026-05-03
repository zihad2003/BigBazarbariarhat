'use client';

import { useState, useEffect } from 'react';
import { 
    Bell, 
    Package, 
    Tag, 
    AlertCircle, 
    CheckCircle2, 
    MoreVertical, 
    Trash2, 
    Check,
    RefreshCcw,
    ChevronRight,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'order' | 'offer' | 'security' | 'system';
    title: string;
    message: string;
    date: string;
    isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'order',
        title: 'Manifest Dispatched',
        message: 'Your artifacts for order #BBB-901234 have been assigned to an expedited logistics channel.',
        date: '2 hours ago',
        isRead: false
    },
    {
        id: '2',
        type: 'offer',
        title: 'Exclusive Access: Pre-Launch',
        message: 'As a Silver Tier curator, you have early access to the upcoming Summer Solstice collection.',
        date: '5 hours ago',
        isRead: false
    },
    {
        id: '3',
        type: 'security',
        title: 'Security Sync Successful',
        message: 'Your account was successfully synchronized from a new terminal ID in Dhaka.',
        date: 'Yesterday',
        isRead: true
    },
    {
        id: '4',
        type: 'system',
        title: 'Loyalty Matrix Updated',
        message: 'Congratulations! You have reached Silver Tier status based on your acquisition history.',
        date: '2 days ago',
        isRead: true
    },
    {
        id: '5',
        type: 'order',
        title: 'Transaction Authorized',
        message: 'Order #BBB-112233 has been successfully authorized and moved to curation.',
        date: '3 days ago',
        isRead: true
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filtered = notifications.filter(n => filter === 'all' || !n.isRead);

    if (!isLoaded) return null;

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Communication Node</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">My Notifications</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        <button 
                            onClick={() => setFilter('all')}
                            className={cn("px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", filter === 'all' ? "bg-black text-white" : "text-gray-400 hover:text-black")}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('unread')}
                            className={cn("px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", filter === 'unread' ? "bg-black text-white" : "text-gray-400 hover:text-black")}
                        >
                            Unread ({notifications.filter(n => !n.isRead).length})
                        </button>
                    </div>
                    <Button onClick={markAllAsRead} variant="ghost" className="h-12 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                        Sync All Read
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-200">
                                <Bell className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Silence Detected</h3>
                            <p className="text-gray-400 text-sm font-medium">Your communication channel is currently clear. No new signals.</p>
                        </div>
                    ) : (
                        filtered.map((notification) => (
                            <motion.div
                                key={notification.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "group flex gap-8 p-8 rounded-[2.5rem] border transition-all relative overflow-hidden",
                                    notification.isRead ? "bg-white border-gray-100 opacity-60" : "bg-white border-black shadow-xl shadow-black/5 ring-1 ring-black/5"
                                )}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 duration-500",
                                    notification.type === 'order' ? "bg-indigo-600 text-white" :
                                    notification.type === 'offer' ? "bg-amber-500 text-white" :
                                    notification.type === 'security' ? "bg-rose-600 text-white" :
                                    "bg-gray-900 text-white"
                                )}>
                                    {notification.type === 'order' ? <Package className="h-6 w-6" /> :
                                     notification.type === 'offer' ? <Sparkles className="h-6 w-6" /> :
                                     notification.type === 'security' ? <ShieldCheck className="h-6 w-6" /> :
                                     <Bell className="h-6 w-6" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <h3 className="font-black text-gray-900 uppercase tracking-tight line-clamp-1">{notification.title}</h3>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{notification.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4">{notification.message}</p>
                                    
                                    <div className="flex items-center gap-6">
                                        {!notification.isRead && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-black flex items-center gap-2"
                                            >
                                                <Check className="h-3 w-3" /> Mark as Synchronized
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-rose-500 flex items-center gap-2"
                                        >
                                            <Trash2 className="h-3 w-3" /> Terminate Signal
                                        </button>
                                    </div>
                                </div>

                                {/* Unread Indicator */}
                                {!notification.isRead && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Notification Preferences Button */}
            <div className="pt-12 border-t border-gray-50 text-center">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                    Modify Communication Protocol Settings <ChevronRight className="h-3 w-3 ml-2" />
                </Button>
            </div>
        </div>
    );
}
