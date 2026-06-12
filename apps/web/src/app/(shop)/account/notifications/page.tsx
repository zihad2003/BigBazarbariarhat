'use client';

import { useState, useEffect } from 'react';
import { 
    Bell, 
    Package, 
    Tag, 
    CheckCircle2, 
    Trash2, 
    Check,
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
        title: 'Order Shipped',
        message: 'Your items for order #BBB-901234 have been shipped via express delivery.',
        date: '2 hours ago',
        isRead: false
    },
    {
        id: '2',
        type: 'offer',
        title: 'Exclusive Early Access',
        message: 'As a Silver member, you get early access to the upcoming Summer collection.',
        date: '5 hours ago',
        isRead: false
    },
    {
        id: '3',
        type: 'security',
        title: 'New Login Detected',
        message: 'Your account was accessed from a new device in Dhaka.',
        date: 'Yesterday',
        isRead: true
    },
    {
        id: '4',
        type: 'system',
        title: 'Membership Upgraded',
        message: 'Congratulations! You have reached Silver Tier based on your order history.',
        date: '2 days ago',
        isRead: true
    },
    {
        id: '5',
        type: 'order',
        title: 'Order Confirmed',
        message: 'Order #BBB-112233 has been confirmed and is being prepared.',
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Notifications</h1>
                    <p className="text-neutral-400 text-sm font-medium mt-1">Stay updated on your orders and account activity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-neutral-50 p-1 rounded-xl border border-neutral-100">
                        <button 
                            onClick={() => setFilter('all')}
                            className={cn("px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all", filter === 'all' ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-900")}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('unread')}
                            className={cn("px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all", filter === 'unread' ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-900")}
                        >
                            Unread ({notifications.filter(n => !n.isRead).length})
                        </button>
                    </div>
                    <Button onClick={markAllAsRead} variant="ghost" className="h-9 px-4 rounded-xl text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">
                        Mark All Read
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <div className="bg-neutral-50 rounded-xl p-16 text-center border border-neutral-100">
                            <Bell className="h-8 w-8 text-neutral-200 mx-auto mb-3" />
                            <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight mb-1">All Caught Up</h3>
                            <p className="text-neutral-400 text-sm font-medium">You have no new notifications.</p>
                        </div>
                    ) : (
                        filtered.map((notification) => (
                            <motion.div
                                key={notification.id}
                                layout
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className={cn(
                                    "flex gap-4 p-4 rounded-xl border transition-all relative",
                                    notification.isRead 
                                        ? "bg-white border-neutral-100 opacity-60" 
                                        : "bg-neutral-50 border-neutral-200"
                                )}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                    notification.type === 'order' ? "bg-blue-50 text-blue-600" :
                                    notification.type === 'offer' ? "bg-amber-50 text-amber-600" :
                                    notification.type === 'security' ? "bg-rose-50 text-rose-600" :
                                    "bg-neutral-100 text-neutral-600"
                                )}>
                                    {notification.type === 'order' ? <Package className="h-5 w-5" /> :
                                     notification.type === 'offer' ? <Sparkles className="h-5 w-5" /> :
                                     notification.type === 'security' ? <ShieldCheck className="h-5 w-5" /> :
                                     <Bell className="h-5 w-5" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3 mb-1">
                                        <h3 className="font-bold text-neutral-900 text-sm tracking-tight line-clamp-1">{notification.title}</h3>
                                        <span className="text-[10px] font-medium text-neutral-400 shrink-0">{notification.date}</span>
                                    </div>
                                    <p className="text-xs text-neutral-400 font-medium leading-relaxed mb-3">{notification.message}</p>
                                    
                                    <div className="flex items-center gap-4">
                                        {!notification.isRead && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-[9px] font-bold uppercase tracking-widest text-blue-600 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
                                            >
                                                <Check className="h-3 w-3" /> Mark as Read
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-[9px] font-bold uppercase tracking-widest text-neutral-300 hover:text-rose-500 flex items-center gap-1.5 transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Unread dot */}
                                {!notification.isRead && (
                                    <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Settings Link */}
            <div className="pt-6 border-t border-neutral-100 text-center">
                <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">
                    Notification Settings <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
            </div>
        </div>
    );
}
