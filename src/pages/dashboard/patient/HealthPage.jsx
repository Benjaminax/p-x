import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Activity, Heart, TrendingUp, Download, Plus, ShieldCheck, Thermometer, Droplets, ArrowUpRight, ArrowDownRight, ClipboardList, X } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import EmergencyCard from '../../../components/patient/EmergencyCard';
import HealthScoreWidget from '../../../components/patient/HealthScoreWidget';

const HealthChart = ({ color = "bg-blue-500" }) => (
    <div className="flex items-end gap-1.5 h-40 mt-6 px-2">
        {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 50, 65, 75, 80, 60].map((h, i) => (
            <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`flex-1 rounded-t-md opacity-80 hover:opacity-100 transition-all hover:scale-x-110 ${color}`}
            />
        ))}
    </div>
);

const HealthPage = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeChart, setActiveChart] = useState('heart');
    const [showEmergencyID, setShowEmergencyID] = useState(false);

    // Get vitals data from localStorage
    const vitalsLog = JSON.parse(localStorage.getItem('vitalsLog') || '[]');
    const currentVitals = JSON.parse(localStorage.getItem('currentVitals') || 'null');

    const exportData = () => {
        if (vitalsLog.length === 0) {
            showToast('No data to export', { type: 'info' });
            return;
        }
        showToast('Exporting health data...', { type: 'success' });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <PageHeader
                title="Health Profile & Stats"
                subtitle="Your centralized digital health records and wellness monitoring."
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={exportData} className="border-slate-200 text-slate-600 hover:bg-slate-50">
                            <Download className="w-4 h-4 mr-2" /> Export Records
                        </Button>
                        <Button onClick={() => navigate('details')} className="bg-black text-white hover:bg-slate-900">
                            <Plus className="w-4 h-4 mr-2" /> New Entry
                        </Button>
                    </div>
                }
            />

            {/* Top Row: Identity & Wellness */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-200 relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/10 rounded-2xl"><ShieldCheck className="w-5 h-5 text-blue-400" /></div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Digital Health ID</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{user?.fullName || 'Patient Name'}</h3>
                            <p className="text-sm text-white/40 mb-8">PX-2026-9932 • Verified Account</p>
                        </div>
                        <Button
                            onClick={() => navigate('/dashboard/patient/emergency-card')}
                            className="w-full bg-white text-black hover:bg-slate-100 rounded-2xl py-6 font-bold tracking-tight"
                        >
                            Open Emergency Card
                        </Button>
                    </motion.div>
                </div>
                <div className="lg:col-span-2">
                    <HealthScoreWidget score={8.5} trend="up" />
                </div>
            </div>

            {/* Vitals & Trends Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <GlassCard className="p-8 border-slate-100 bg-white shadow-sm overflow-hidden h-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 rounded-2xl"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Vitals Evolution</h3>
                                    <p className="text-xs text-slate-400 font-medium">Monitoring 7-day volatility</p>
                                </div>
                            </div>
                            <div className="flex gap-1 p-1 bg-slate-50 rounded-xl">
                                {['heart', 'usage', 'temp'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveChart(type)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${activeChart === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {type === 'heart' ? 'Heart' : type === 'usage' ? 'BP' : 'Temp'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <HealthChart color={activeChart === 'heart' ? "bg-rose-500" : activeChart === 'usage' ? "bg-blue-600" : "bg-orange-500"} />
                        <div className="mt-8 flex items-center justify-center gap-8 border-t border-slate-50 pt-8">
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Peak</p>
                                <p className="text-xl font-bold text-slate-900">88 <span className="text-xs text-slate-400">bpm</span></p>
                            </div>
                            <div className="w-px h-8 bg-slate-100" />
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Average</p>
                                <p className="text-xl font-bold text-slate-900">72 <span className="text-xs text-slate-400">bpm</span></p>
                            </div>
                            <div className="w-px h-8 bg-slate-100" />
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Resting</p>
                                <p className="text-xl font-bold text-slate-900">64 <span className="text-xs text-slate-400">bpm</span></p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Heart className="w-5 h-5" /></div>
                            <div className="flex items-center gap-1 text-green-500 font-bold text-xs uppercase tracking-wider">
                                <ArrowDownRight className="w-3 h-3" /> 2%
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Resting Heart</p>
                        <h4 className="text-2xl font-bold text-slate-900">72 <span className="text-sm font-medium text-slate-300">bpm</span></h4>
                    </Card>

                    <Card className="p-6 border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Activity className="w-5 h-5" /></div>
                            <div className="flex items-center gap-1 text-green-500 font-bold text-xs uppercase tracking-wider">
                                <TrendingUp className="w-3 h-3" /> Normal
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Pressure</p>
                        <h4 className="text-2xl font-bold text-slate-900">120/80 <span className="text-sm font-medium text-slate-300">mmHg</span></h4>
                    </Card>

                    <Card className="p-6 border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-50 rounded-xl text-orange-500"><Thermometer className="w-5 h-5" /></div>
                            <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                Stable
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Body Temp</p>
                        <h4 className="text-2xl font-bold text-slate-900">98.6 <span className="text-sm font-medium text-slate-300">°F</span></h4>
                    </Card>
                </div>
            </div>

            {/* Treatment & History Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8 border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-50 rounded-2xl"><ClipboardList className="w-5 h-5 text-purple-600" /></div>
                            <h3 className="font-bold text-lg text-slate-900">Treatment Plan</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400">Current Phase: 2/4</span>
                    </div>

                    <div className="space-y-6">
                        {[
                            { name: "Post-Surgical Recovery", progress: 75, date: "Ends April 12", color: "bg-blue-600" },
                            { name: "Physical Therapy (Leg)", progress: 40, date: "Ends May 30", color: "bg-purple-600" },
                            { name: "Medication Regimen A", progress: 92, date: "Ends Tomorrow", color: "bg-emerald-600" }
                        ].map((plan, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <h5 className="text-sm font-bold text-slate-800">{plan.name}</h5>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{plan.date}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${plan.progress}%` }}
                                        transition={{ duration: 1, delay: i * 0.2 }}
                                        className={`h-full ${plan.color}`}
                                    />
                                </div>
                                <p className="text-right text-[10px] font-bold text-slate-500">{plan.progress}% Complete</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard className="p-0 border-slate-100 bg-white shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900">Lab History</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/patient/health/log')} className="text-xs text-blue-600 border-blue-100 hover:bg-blue-50">View Daily Log (Jan 29)</Button>
                            <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-slate-600">View Full History</Button>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[
                            { test: "Full Blood Count", date: "Jan 24, 2026", result: "In Range", icon: Droplets, color: "text-blue-500" },
                            { test: "MRI Brain Scan", date: "Jan 18, 2026", result: "View Report", icon: Activity, color: "text-purple-500" },
                            { test: "Cholesterol Panel", date: "Jan 12, 2026", result: "Attention", icon: TrendingUp, color: "text-amber-500" }
                        ].map((lab, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors`}><lab.icon className={`w-4 h-4 ${lab.color}`} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{lab.test}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{lab.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${lab.result === 'Attention' ? 'text-amber-500' : 'text-slate-400'}`}>{lab.result}</span>
                                    <ArrowUpRight className="w-3 h-3 ml-2 inline-block text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Emergency ID Modal Overlay */}
            <AnimatePresence>
                {showEmergencyID && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                            onClick={() => setShowEmergencyID(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-10 w-full max-w-sm"
                        >
                            <button
                                onClick={() => setShowEmergencyID(false)}
                                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <EmergencyCard data={{
                                fullName: user?.fullName,
                                patientId: user?.id?.substring(0, 10).toUpperCase() || 'PX-2026-9932',
                                bloodGroup: user?.bloodGroup || 'O+',
                                genotype: user?.genotype || 'AA',
                                allergies: user?.allergies || 'No known allergies',
                                emergencyContact: user?.emergencyContact || '+1 (555) 000-0000'
                            }} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthPage;
