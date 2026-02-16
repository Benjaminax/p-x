import { useState } from 'react';
import { Bell, Check, Info, AlertCircle, Clock, CheckCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: "Appointment Confirmed",
        message: "Your consultation with Dr. Sarah Johnson is confirmed for Feb 12th at 10:00 AM.",
        type: "success",
        time: "2 hours ago",
        read: false
    },
    {
        id: 2,
        title: "New Lab Results",
        message: "Your Blood Work (v2.4) results have been uploaded by the laboratory.",
        type: "info",
        time: "5 hours ago",
        read: true
    },
    {
        id: 3,
        title: "Prescription Renewal",
        message: "Your prescription for Metformin is ready for pickup at City Pharmacy.",
        type: "alert",
        time: "Yesterday",
        read: true
    },
    {
        id: 4,
        title: "Security Alert",
        message: "A new login was detected from a Chrome browser on Windows.",
        type: "warning",
        time: "2 days ago",
        read: true
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const { showToast } = useToast();

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('All notifications marked as read', { type: 'success' });
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <PageHeader
                title="Notifications"
                subtitle="Stay updated with your latest health and activity alerts."
                showBack={true}
            />

            <div className="flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-sm">
                <div className="text-sm font-medium text-zinc-500 ml-2">
                    {unreadCount > 0 ? (
                        <>You have <span className="text-black font-bold">{unreadCount} unread</span> notification{unreadCount !== 1 ? 's' : ''}</>
                    ) : (
                        "All clear! You've read all notifications."
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 font-bold gap-2"
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                >
                    <CheckCheck className="w-4 h-4" />
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <GlassCard
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-6 border-white/40 transition-all hover:shadow-lg cursor-pointer group ${!notif.read ? 'bg-white/90 ring-1 ring-blue-500/20' : 'bg-white/40 opacity-80'}`}
                    >
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${notif.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                                notif.type === 'info' ? 'bg-blue-50 text-blue-500' :
                                    notif.type === 'alert' ? 'bg-amber-50 text-amber-500' :
                                        'bg-red-50 text-red-500'
                                }`}>
                                {notif.type === 'success' ? <Check className="w-6 h-6" /> :
                                    notif.type === 'info' ? <Info className="w-6 h-6" /> :
                                        notif.type === 'alert' ? <Clock className="w-6 h-6" /> :
                                            <AlertCircle className="w-6 h-6" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-lg transition-colors ${!notif.read ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs font-semibold text-zinc-400">{notif.time}</span>
                                </div>
                                <p className={`text-sm leading-relaxed ${!notif.read ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                    {notif.message}
                                </p>
                            </div>

                            {!notif.read && (
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 ring-4 ring-blue-50 shadow-sm shadow-blue-500/50" />
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
