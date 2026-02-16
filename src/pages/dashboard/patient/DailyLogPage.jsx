import { motion } from 'framer-motion';
import { Activity, Heart, Thermometer, Droplets, Clock, Calendar, ArrowLeft, MoreHorizontal, ChevronRight, Zap, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

const DailyLogPage = () => {
    const navigate = useNavigate();
    const date = "2026-01-29";

    const metrics = [
        { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", trend: "+2" },
        { label: "Blood Pressure", value: "118/76", unit: "mmHg", icon: Activity, color: "text-blue-500", bg: "bg-blue-50", trend: "-3" },
        { label: "Temperature", value: "36.6", unit: "°C", icon: Thermometer, color: "text-amber-500", bg: "bg-amber-50", trend: "0.0" },
        { label: "Blood Oxygen", value: "98", unit: "%", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-50", trend: "+1" },
    ];

    const entries = [
        { time: "08:15 AM", type: "Vitals Check", description: "Standard morning routine. All metrics within normal range.", source: "Apple Watch Sync" },
        { time: "09:30 AM", type: "Medication", description: "Lisinopril 10mg taken with breakfast.", source: "Self Logged" },
        { time: "02:00 PM", type: "Symptom", description: "Mild headache after screen exposure. Duration: 30 mins.", source: "Self Logged" },
        { time: "06:45 PM", type: "Activity", description: "30-minute afternoon walk. Average HR: 115 bpm.", source: "Strava Sync" },
    ];

    return (
        <div className="h-full flex flex-col gap-6 font-['Inter']">
            <PageHeader
                title={`Daily Health Log: Jan 29, 2026`}
                subtitle="Detailed vitals, entries, and activity markers for this session."
                action={
                    <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl border-slate-200">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="p-6 border-slate-100 hover:shadow-lg transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${m.bg}`}>
                                    <m.icon className={`w-6 h-6 ${m.color}`} />
                                </div>
                                <Badge className={m.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : m.trend.startsWith('-') ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600'}>
                                    {m.trend}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-['Outfit']">{m.label}</h4>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-3xl font-bold font-['Outfit']">{m.value}</span>
                                    <span className="text-sm font-medium text-slate-400">{m.unit}</span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                {/* Timeline Section */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <Card className="flex-1 border-slate-100 bg-white/50 backdrop-blur-sm overflow-hidden flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <ListChecks className="w-5 h-5 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl font-bold font-['Outfit']">Clinical Timeline</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-8">
                            <div className="space-y-8 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[39px] top-2 bottom-2 w-px bg-slate-100" />

                                {entries.map((entry, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        className="relative flex gap-8 group"
                                    >
                                        <div className="w-20 text-right pt-2">
                                            <span className="text-xs font-bold text-slate-400">{entry.time}</span>
                                        </div>

                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10 relative group-hover:border-blue-400 transition-colors">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            </div>
                                        </div>

                                        <div className="flex-1 pb-8 border-b border-slate-50 group-last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">{entry.type}</h4>
                                                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-100 bg-white">
                                                    {entry.source}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {entry.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summaries Sidebar */}
                <div className="w-full lg:w-96 flex flex-col gap-6">
                    <Card className="border-slate-100 bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white p-6">
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-blue-400" />
                                <CardTitle className="text-lg font-bold font-['Outfit']">Daily AI Insight</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                Your heart rate variability indicates stable recovery. Morning blood pressure remains optimal. Consideration: The afternoon headache correlates with localized dehydration or screen fatigue.
                            </p>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Health Index</p>
                                        <p className="text-lg font-bold text-blue-900 font-['Outfit']">Optimal (8.8/10)</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 border-slate-100 bg-white p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <h3 className="text-base font-bold font-['Outfit']">Activity Distribution</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Resting', value: 75, color: 'bg-emerald-500' },
                                { label: 'Active', value: 15, color: 'bg-blue-500' },
                                { label: 'Peak', value: 10, color: 'bg-rose-500' },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                                        <span className="text-sm font-bold">{item.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <Button className="w-full bg-slate-900 text-white rounded-xl hover:bg-black font-bold h-12">
                                <Download className="w-4 h-4 mr-2" /> Export Report
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DailyLogPage;
