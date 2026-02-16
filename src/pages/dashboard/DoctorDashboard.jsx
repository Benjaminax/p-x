import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, Activity, BrainCircuit, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import GlassCard from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Zap, Target, History, TrendingUp } from 'lucide-react';

const PatientQueueItem = ({ name, time, status, symptoms }) => (
    <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-border-hover)] hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center font-bold text-[var(--color-text-secondary)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-background)] transition-colors">
                {name.charAt(0)}
            </div>
            <div>
                <h4 className="font-medium text-[var(--color-text-primary)]">{name}</h4>
                <p className="text-xs text-[var(--color-text-secondary)] truncate max-w-[200px]">{symptoms}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${status === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                status === 'Ready' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
                }`}>
                {status}
            </span>
            <div className="text-xs text-[var(--color-text-muted)]">{time}</div>
        </div>
    </div>
);

const ClinicalInsights = () => (
    <Card className="border-slate-100 bg-white shadow-sm h-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 rounded-xl"><Zap className="w-5 h-5 text-rose-500 fill-rose-500/10" /></div>
                <CardTitle className="text-xl font-bold">Clinical Insights</CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-lg text-rose-600">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">3 Critical</span>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                <div className="absolute top-0 right-0 p-3 opacity-10"><Activity className="w-12 h-12 text-rose-600" /></div>
                <div className="flex items-start gap-3 relative z-10">
                    <div className="h-2 w-2 mt-2 rounded-full bg-rose-500 animate-pulse" />
                    <div>
                        <h4 className="text-sm font-bold text-rose-900">Abnormal MRI Pattern Detected</h4>
                        <p className="text-[10px] text-rose-600/70 font-medium mb-2">Patient: John Doe • System: NeuroAI v2.4</p>
                        <p className="text-xs text-rose-800 leading-relaxed max-w-[200px]">Temporal lobe inflammation detected in MRI-2939. Immediate review recommended.</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                <div className="absolute top-0 right-0 p-3 opacity-10"><Target className="w-12 h-12 text-blue-600" /></div>
                <div className="flex items-start gap-3 relative z-10">
                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                        <h4 className="text-sm font-bold text-blue-900">Chronic BP Trend Analysis</h4>
                        <p className="text-[10px] text-blue-600/70 font-medium mb-2">Patient: Sarah Smith • System: WellnessAI</p>
                        <p className="text-xs text-blue-800 leading-relaxed max-w-[200px]">15% increase in resting BP over 30 days. Consider medication adjustment.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mt-6">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Tasks Pending</h5>
                {[
                    { title: "Review Lab Results: Emily D.", time: "14m ago", icon: ClipboardList, color: "text-purple-500", bg: "bg-purple-50" },
                    { title: "Sign Discharge: Robert W.", time: "1h ago", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" }
                ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${task.bg}`}><task.icon className={`w-4 h-4 ${task.color}`} /></div>
                            <span className="text-xs font-bold text-slate-700">{task.title}</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{task.time}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const WorkloadAnalytics = () => (
    <Card className="border-slate-100 bg-white shadow-sm overflow-hidden h-full">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl"><Target className="w-5 h-5 text-blue-500 fill-blue-500/10" /></div>
                    <CardTitle className="text-xl font-bold">Workload Efficiency</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border-blue-100">Optimal</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex items-end gap-1.5 h-32 mt-4 px-2">
                {[45, 70, 55, 90, 65, 80, 40, 75, 95, 60, 50, 85].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 rounded-t-lg bg-blue-500/20 hover:bg-blue-600 transition-all cursor-pointer relative group"
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 p-1.5 bg-black text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            {Math.round(h / 1.2)} patients
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-8">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Avg Time</p>
                    <p className="text-xl font-bold text-slate-900">18.5 <span className="text-xs text-slate-300">min</span></p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Utilization</p>
                    <p className="text-xl font-bold text-slate-900">92% <span className="text-xs text-slate-300"><ArrowUpRight className="w-3 h-3 inline" /></span></p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Burnout Risk</p>
                    <p className="text-xl font-bold text-emerald-500">Low</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const doctorName = user?.fullName?.split(' ')[1] || 'Smith';

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        Dr. {doctorName}'s Workshop
                    </h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" /> 12 Consultations Pending
                        </div>
                        <div className="w-px h-3 bg-slate-200" />
                        <div className="flex items-center gap-1.5 text-rose-500">
                            <Zap className="w-4 h-4 fill-rose-500/10" /> 3 High Priority AI Finds
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-6 h-12">
                        <History className="w-4 h-4 mr-2" /> Activity Log
                    </Button>
                    <Button className="bg-black text-white hover:bg-slate-900 rounded-xl px-8 h-12 shadow-xl shadow-slate-200">
                        Start Rounds
                    </Button>
                </div>
            </div>

            {/* AI Diagnostics & Workload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ClinicalInsights />
                <WorkloadAnalytics />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Queue */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-100 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-100 rounded-xl"><Users className="w-5 h-5 text-slate-600" /></div>
                                <CardTitle className="text-xl font-bold">Patient Queue</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search queue..."
                                        className="pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border-0 rounded-lg focus:ring-1 focus:ring-blue-500 w-48 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-9 px-3 border-slate-200 text-slate-400">
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                <PatientQueueItem name="Michael Brown" time="10:00 AM" status="Ready" symptoms="Migraine, Visual Aura" />
                                <PatientQueueItem name="Emily Davis" time="10:30 AM" status="Urgent" symptoms="Chest Pain, Shortness of Breath" />
                                <PatientQueueItem name="Robert Wilson" time="11:00 AM" status="Check-in" symptoms="Annual Physical" />
                                <PatientQueueItem name="Lisa Anderson" time="11:30 AM" status="Remote" symptoms="Follow-up: Hypertension" />
                                <div className="p-6 text-center">
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-bold">View Afternoon Schedule</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <GlassCard className="p-8 bg-slate-900 border-0 text-white relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700" />
                        <div className="relative z-10">
                            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-6 ring-1 ring-white/20"><BrainCircuit className="w-6 h-6 text-blue-400" /></div>
                            <h3 className="text-2xl font-bold mb-2 tracking-tight">NeuroDiagnostics AI</h3>
                            <p className="text-sm text-white/40 mb-10 leading-relaxed font-medium">Real-time neural pattern recognition for advanced diagnostic support.</p>

                            <Button
                                onClick={() => navigate('/dashboard/doctor/neuro')}
                                className="w-full bg-blue-600 text-white hover:bg-blue-500 rounded-2xl py-6 font-bold tracking-tight shadow-xl shadow-blue-900/40 border-0 transition-transform active:scale-[0.98]"
                            >
                                Enter AI Command Suite
                            </Button>
                        </div>
                    </GlassCard>

                    <Card className="p-6 border-slate-100 bg-white shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" /> Team Performance
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: "Patient Turnover", val: "12% ↗" },
                                { label: "AI Diagnostic Accuracy", val: "99.2%" },
                                { label: "Avg Consultation", val: "18m" }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                    <span className="text-slate-400">{row.label}</span>
                                    <span className="text-slate-900">{row.val}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
