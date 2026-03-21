import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Upload, BrainCircuit, Zap, FileText, X, CheckCircle, AlertCircle, ShieldAlert, Cpu, History, TrendingUp, Download, Eye, Layers, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/ui/Toast';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

const AIPage = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedModel, setSelectedModel] = useState('neuroscan');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }

            showToast(`File selected: ${file.name}`, { type: 'success' });
        }
    };

    const handleUploadClick = () => {
        document.getElementById('ai-scan-upload')?.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
        const input = document.getElementById('ai-scan-upload');
        if (input) input.value = '';
    };

    const handleRunAnalysis = () => {
        if (!selectedFile) {
            showToast('Please upload a scan first', { type: 'error' });
            return;
        }

        // Redirect to NeuroDashboard with the file
        showToast('Redirecting to NeuroDashboard for analysis...', { type: 'info' });
        setTimeout(() => {
            navigate('/dashboard/doctor/neuro');
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-10">
            <PageHeader
                title="AI Diagnostics Command Suite"
                subtitle="Manage real-time neural processing and diagnostic AI models."
                showBack={true}
                action={
                    <div className="flex gap-2">
                        <Badge className="bg-emerald-100 text-emerald-600 border-0 font-bold flex items-center gap-1.5 px-3">
                            <Cpu className="w-3.5 h-3.5" /> All Models Online
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-600 border-0 font-bold flex items-center gap-1.5 px-3 text-[10px] uppercase tracking-wider">
                            v7.4 Neural Core
                        </Badge>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Left Column: Command & Upload (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="p-8 border-slate-100 bg-white shadow-sm rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-slate-900 rounded-2xl"><Zap className="w-5 h-5 text-blue-400" /></div>
                            <h3 className="font-bold text-xl tracking-tight">Launcher</h3>
                        </div>

                        <div
                            onClick={handleUploadClick}
                            className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <input
                                id="ai-scan-upload"
                                type="file"
                                onChange={handleFileSelect}
                                accept="image/*,.dcm,.nii,.nii.gz"
                                className="hidden"
                            />
                            {selectedFile && preview ? (
                                <div className="relative w-full z-10">
                                    <img src={preview} alt="Scan preview" className="max-h-40 mx-auto rounded-xl object-contain shadow-lg" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFile();
                                        }}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-white text-slate-400 rounded-full flex items-center justify-center shadow-xl hover:text-rose-500 transition-colors border border-slate-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest truncate">{selectedFile.name}</p>
                                </div>
                            ) : (
                                <div className="z-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-4 ring-white group-hover:bg-blue-100/50">
                                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm mb-1">Upload Source</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DICOM | NIfTI | JPG</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Active Model</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="neuroscan" className="bg-white">NeuroScan v4.2</option>
                                    <option value="cardio" className="bg-white">CardioAI v7.1</option>
                                    <option value="pulmo" className="bg-white">PulmoNet v2.5</option>
                                </select>
                            </div>

                            <Button
                                className="w-full py-7 bg-slate-900 text-white hover:bg-black rounded-2xl font-bold tracking-tight shadow-xl shadow-slate-200 mt-4"
                                onClick={handleRunAnalysis}
                                disabled={!selectedFile}
                                isLoading={isProcessing}
                            >
                                <Zap className="w-4 h-4 mr-2 fill-blue-400 text-blue-400" /> Initializing Analysis
                            </Button>
                        </div>
                    </GlassCard>

                    <Card className="p-6 border-slate-100 bg-white shadow-sm rounded-3xl">
                        <div className="flex items-center gap-2 mb-4 text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">System Load</span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-emerald-500" />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>Neural Load</span>
                                <span>42.8ms Latency</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Center Column: Active Feed & History (6 cols) */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                            <History className="w-5 h-5 text-slate-400" /> Recent Insights
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Only</Button>
                            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Archived</Button>
                        </div>
                    </div>

                    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
                        {[
                            { id: 'PX-9921', status: 'CRITICAL', title: 'Brain Scan - Michael Brown', time: '14 min ago', score: '98.4%', zone: 'Temporal Lobe', color: 'rose' },
                            { id: 'PX-9844', status: 'STABLE', title: 'MRI Follow-up - Emily Davis', time: '2 hours ago', score: '2.1%', zone: 'Frontal Cortex', color: 'emerald' },
                            { id: 'PX-9730', status: 'PENDING', title: 'CT Scan - Robert Wilson', time: '5 hours ago', score: 'N/A', zone: 'Lumbar Spine', color: 'slate' }
                        ].map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <GlassCard className="p-0 overflow-hidden border-slate-50 bg-white shadow-sm rounded-[2rem] group hover:shadow-xl hover:shadow-slate-100 transition-all">
                                    <div className="p-8 flex items-start gap-8">
                                        <div className="w-32 h-32 bg-slate-900 rounded-2xl overflow-hidden relative shrink-0 group-hover:scale-105 transition-transform duration-500 border border-slate-800">
                                            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay" />
                                            <div className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg"><Layers className="w-3 h-3 text-blue-400" /></div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                                                <Button size="sm" className="bg-white text-black font-bold text-[10px] rounded-full px-4 h-8"><Eye className="w-3 h-3 mr-2" /> Inspect</Button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-xl text-slate-900 tracking-tight">{job.title}</h4>
                                                        <Badge className={`bg-${job.color}-50 text-${job.color}-500 border-0 text-[10px] font-bold`}>{job.status}</Badge>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.id} • Processed {job.time}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 bg-${job.color}-50 text-${job.color}-600 rounded-xl text-[10px] font-bold border border-${job.color}-100`}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {job.score === 'N/A' ? 'Processing...' : `Anomaly Prob: ${job.score}`}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold border border-slate-100">
                                                    <Layers className="w-3 h-3" />
                                                    Zone: {job.zone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-4 border-t border-slate-50 flex justify-between items-center sm:px-8">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinician: Dr. Smith</p>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900 font-bold h-10 px-4">Raw Data</Button>
                                            <Button className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl shadow-sm"><Download className="w-3 h-3 mr-2 text-blue-500" /> Export PDF</Button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: AI Center & Alerts (3 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-0 bg-rose-600 text-white rounded-[2.5rem] shadow-xl shadow-rose-200/50 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-rose-200" /> Critical Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "PX-9921 - Tumor Alert", level: "High", time: "2m ago" },
                                { title: "PX-9812 - Neural Shift", level: "Med", time: "1h ago" }
                            ].map((alert, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-bold leading-tight pr-4">{alert.title}</p>
                                        <Badge className="bg-white/20 text-white border-0 text-[8px] uppercase">{alert.level}</Badge>
                                    </div>
                                    <p className="text-[10px] text-white/60 font-medium">{alert.time}</p>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-white/60 hover:text-white text-xs font-bold mt-2">Dismiss All Alerts</Button>
                        </CardContent>
                    </Card>

                    <GlassCard className="p-8 bg-slate-900 border-0 text-white rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700" />
                        <BrainCircuit className="w-8 h-8 mb-6 text-blue-400" />
                        <h4 className="text-xl font-bold mb-2 tracking-tight leading-tight">Neural Pattern recognition</h4>
                        <p className="text-[10px] text-white/40 mb-10 leading-relaxed font-bold uppercase tracking-widest">Global Insights Feed</p>

                        <div className="space-y-6">
                            {[
                                { label: "Glioma Matching", val: "94.2%", trend: "up" },
                                { label: "Meningioma Matching", val: "66.1%", trend: "up" }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white/40">{stat.label}</span>
                                    <span className={`text-xs font-extrabold ${stat.trend === 'up' ? 'text-rose-400' : 'text-emerald-400'}`}>{stat.val}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <Button variant="outline" className="w-full rounded-2xl border-slate-100 bg-white text-slate-400 font-bold py-6 hover:bg-slate-50 transition-all">
                        <Settings className="w-4 h-4 mr-2" /> Global API Settings
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default AIPage;
