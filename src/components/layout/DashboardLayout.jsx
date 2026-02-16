
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    LogOut,
    Menu,
    X,
    User,
    Activity,
    MessageSquare,
    FileText,
    Bell,
    Search,
    BrainCircuit
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import SearchInput from '../ui/SearchInput';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, collapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink to={to}>
            <div className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group relative",
                isActive
                    ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30 translate-x-1"
                    : "text-slate-500 hover:bg-[var(--color-surface-hover)] hover:text-slate-900"
            )}>
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900")} />

                {!collapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium whitespace-nowrap"
                    >
                        {label}
                    </motion.span>
                )}

                {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {label}
                    </div>
                )}
            </div>
        </NavLink>
    );
};

const DashboardLayout = ({ role = 'patient' }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const effectiveRole = useMemo(() => user?.role || role, [role, user?.role]);

    const displayName = user?.fullName || (effectiveRole === 'doctor' ? 'Doctor' : 'Patient');
    const subtitle = effectiveRole === 'doctor' ? 'Clinical Access' : 'Member Access';

    // Navigation Items based on Role
    const navItems = effectiveRole === 'patient'
        ? [
            { icon: LayoutDashboard, label: 'Overview', to: '/dashboard/patient' },
            { icon: Activity, label: 'My Health', to: '/dashboard/patient/health' },
            { icon: Calendar, label: 'Appointments', to: '/dashboard/patient/appointments' },
            { icon: MessageSquare, label: 'Messages', to: '/dashboard/patient/messages' },
            { icon: FileText, label: 'Records', to: '/dashboard/patient/records' },
        ]
        : [
            { icon: LayoutDashboard, label: 'Workspace', to: '/dashboard/doctor' },
            { icon: User, label: 'Patients', to: '/dashboard/doctor/patients' },
            { icon: BrainCircuit, label: 'AI Assistant', to: '/dashboard/doctor/ai' },
            { icon: Calendar, label: 'Schedule', to: '/dashboard/doctor/schedule' },
            { icon: MessageSquare, label: 'Consults', to: '/dashboard/doctor/consults' },
        ];

    return (
        <div className="flex h-screen w-full bg-[var(--color-bg)] overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 240 }}
                animate={{ width: collapsed ? 80 : 260 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-white/95 backdrop-blur border-r border-[var(--color-border)] flex flex-col z-20 shadow-[4px_0_24px_-8px_rgba(15,23,42,0.12)]"
            >
                {/* Sidebar Header */}
                <div className="h-20 flex items-center px-6 border-b border-[var(--color-border)] justify-between">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="h-9 w-9 bg-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/40 text-white font-semibold">
                                PX
                            </div>
                            <span className="text-lg font-semibold tracking-tight text-slate-900">Project X</span>
                        </motion.div>
                    )}

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-black transition-colors"
                    >
                        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <SidebarItem key={item.to} {...item} collapsed={collapsed} />
                    ))}
                </div>

                {/* User Profile / Menu */}
                <div className="p-4 border-t border-[var(--color-border)] bg-slate-50/80 backdrop-blur-sm">
                    <div className={cn(
                        "relative",
                        collapsed ? "justify-center" : ""
                    )}>
                        <button
                            onClick={() => setShowProfileMenu((s) => !s)}
                            className={cn("flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm hover:border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer group w-full", collapsed ? "justify-center" : "")}
                            aria-haspopup="true"
                            aria-expanded={showProfileMenu}
                        >
                            <div className="h-10 w-10 bg-[var(--color-surface-hover)] rounded-full flex items-center justify-center flex-shrink-0 border border-white shadow-sm">
                                <User className="w-5 h-5 text-[var(--color-accent)]" />
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-semibold truncate text-zinc-900">{displayName}</p>
                                    <p className="text-xs text-zinc-500 truncate font-medium">{subtitle}</p>
                                </div>
                            )}
                            {!collapsed && (
                                <span className="ml-auto text-zinc-400 group-hover:text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                                </span>
                            )}
                        </button>

                        {showProfileMenu && !collapsed && (
                            <div className="absolute left-4 bottom-16 w-48 bg-white rounded-lg shadow-lg border border-zinc-100 p-2 z-50">
                                <button onClick={() => { setShowProfileMenu(false); navigate('/profile'); }} className="w-full text-left px-3 py-2 rounded hover:bg-zinc-50">Profile</button>
                                <button onClick={() => { setShowProfileMenu(false); navigate('/settings'); }} className="w-full text-left px-3 py-2 rounded hover:bg-zinc-50">Settings</button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowProfileMenu(false);
                                        navigate('/login');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded hover:bg-zinc-50 text-red-600"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)]">
                {/* Top Header */}
                <header className="h-16 bg-white/95 backdrop-blur border-b border-[var(--color-border)] flex items-center justify-between px-6 sm:px-8">
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                        <SearchInput placeholder={effectiveRole === 'patient' ? 'Find a doctor, department, or record...' : 'Search for patients, symptoms, or files...'} onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
                    </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>

                        <Button
                            aria-label="Toggle AI Assistant"
                            onClick={() => setShowAIPanel((s) => !s)}
                            className="px-3 py-1.5 bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] flex items-center gap-2 shadow-md shadow-[var(--color-accent)]/30"
                        >
                            <BrainCircuit className="w-4 h-4" /> AI
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                    <Outlet />
                </div>

                {/* AI Assistant Right Panel */}
                {showAIPanel && (
                    <aside className="fixed right-4 sm:right-6 top-20 w-[360px] glass-panel rounded-xl p-4 shadow-float z-40 animate-slide-up border border-[var(--color-border)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h4 className="text-lg font-semibold">AI Assistant</h4>
                                <p className="text-sm text-zinc-600">Quick diagnostics, recent analyses, and actions.</p>
                            </div>
                            <button onClick={() => setShowAIPanel(false)} className="p-1 rounded hover:bg-zinc-100">
                                <X className="w-4 h-4 text-zinc-600" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            <GlassCard className="p-3">
                                <p className="text-sm">No active analyses. Use <strong>Run Analysis</strong> to start a new job.</p>
                                <div className="mt-3 flex gap-2">
                                    <Button className="bg-black text-white hover:bg-black/90 flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4" /> Run Analysis
                                    </Button>
                                    <Button className="bg-zinc-800 text-white hover:bg-zinc-700">Reports</Button>
                                </div>
                            </GlassCard>

                            <div className="text-xs text-zinc-500">
                                <p>Tip: Press <span className="font-medium">AI</span> to toggle this panel. Motion respects <code>prefers-reduced-motion</code>.</p>
                            </div>
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
};

export default DashboardLayout;
