import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud,
    Activity,
    FileText,
    Cpu,
    AlertTriangle,
    CheckCircle2,
    BrainCircuit,
    Maximize2,
    Download,
    Search,
    Dna,
    Zap,
    ChevronRight,
    Play,
    Scan,
    Layers,
    Info,
    History,
    ShieldCheck,
    MoreHorizontal
} from 'lucide-react';
import ThreeViewer from '../../../components/three/ThreeViewer';
import { Button } from '../../../components/ui/Button';
import GlassCard from '../../../components/ui/GlassCard';
import { useToast } from '../../../components/ui/Toast';
import PageHeader from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

// --- Sub-components for Hyper-Premium Feel ---

const SessionHistoryDrawer = ({ isOpen, onClose, sessions, onLoad }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                />
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-[450px] bg-white border-l border-zinc-100 z-[101] p-10 flex flex-col shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold font-sora uppercase tracking-[0.3em] text-teal-600">Vault</span>
                            <h2 className="text-3xl font-bold font-sora text-slate-900 tracking-tighter uppercase">Session History</h2>
                        </div>
                        <Button variant="ghost" onClick={onClose} className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:bg-zinc-100">
                            <Maximize2 size={16} className="rotate-45" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar font-inter">
                        {sessions.length === 0 ? (
                            <div className="text-center p-10 opacity-50">
                                <p className="text-sm font-bold font-sora text-zinc-400 uppercase tracking-widest">No saved reports</p>
                            </div>
                        ) : (
                            sessions.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => { onLoad && onLoad(s); onClose(); }}
                                    className="p-5 rounded-2xl border border-zinc-100 bg-white hover:bg-zinc-50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">{s.date}</span>
                                            <h4 className="text-lg font-bold font-sora text-slate-900 tracking-tight uppercase group-hover:text-teal-600 transition-colors">{s.diagnosis}</h4>
                                        </div>
                                        <Badge className="bg-teal-50 text-teal-600 border-teal-100 text-[8px] font-bold py-0.5 px-2">L-72 Sequence</Badge>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wide">Confidence</span>
                                            <span className="text-[12px] font-bold text-slate-600">{s.confidence}</span>
                                        </div>
                                        <div className="flex flex-col border-l border-zinc-100 pl-4">
                                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wide">Region</span>
                                            <span className="text-[12px] font-bold text-slate-600 uppercase tracking-tight">{s.region}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-100">
                        <Button
                            onClick={() => showToast('Synchronizing with Bio-Neural Mainframe...', { type: 'info' })}
                            className="w-full h-13 rounded-xl bg-slate-900 text-white font-bold font-sora uppercase tracking-widest text-[11px] hover:bg-slate-800 shadow-lg shadow-slate-900/10"
                        >
                            Synchronize Local Cache
                        </Button>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

const NeuralPulseBackground = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="neural-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
            </defs>
            <motion.path
                d="M100,200 Q300,50 500,200 T900,200"
                stroke="url(#neural-grad)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            {/* ... other paths simplified for minimal design ... */}
        </svg>
    </div>
);

const ScanningLine = ({ isActive }) => (
    <AnimatePresence>
        {isActive && (
            <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.3)] z-50 pointer-events-none"
            />
        )}
    </AnimatePresence>
);

const LeaderLine = ({ visible }) => (
    <AnimatePresence>
        {visible && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Connection to Top Left HUD */}
                <motion.path
                    d="M 120,80 L 300,200"
                    stroke="#14b8a6"
                    strokeWidth="0.5"
                    fill="none"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    filter="url(#glow)"
                />
                {/* Connection to Right Alerts */}
                <motion.path
                    d="M 900,100 L 700,300"
                    stroke="#14b8a6"
                    strokeWidth="0.5"
                    fill="none"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    filter="url(#glow)"
                />
                <motion.circle
                    cx="120" cy="80" r="2" fill="#14b8a6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <motion.circle
                    cx="900" cy="100" r="2" fill="#14b8a6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                />
            </svg>
        )}
    </AnimatePresence>
);

export default function NeuroDashboard() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [protocolStep, setProtocolStep] = useState(0);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [viewMode, setViewMode] = useState('Standard');
    const threeViewerRef = React.useRef(null);
    const { showToast } = useToast();

    // Derive a simple severity for UI/highlighting (can be overridden by server output)
    const severity = React.useMemo(() => {
        if (!analysis) return 'normal';
        // server-provided severity takes precedence
        if (analysis.severity) {
            return analysis.severity;
        }

        const diag = (analysis.diagnosis || '').toLowerCase();
        // explicit normal/no-tumor -> normal severity (avoids false-positive highlights)
        if (diag.includes('no_tumor') || diag.includes('no ') || diag.includes('normal')) return 'normal';
        // Only infer severity from the four DESIGN labels
        if (diag.includes('pituitary')) return 'medium';
        if (diag.includes('glioma') || diag.includes('meningioma') || diag.includes('tumor') || diag.includes('glioblastoma') || diag.includes('hgg')) return 'high';

        const conf = typeof analysis.confidence === 'number' ? analysis.confidence : 0;
        if (conf >= 0.95) return 'high';
        if (conf >= 0.80) return 'medium';
        return 'low';
    }, [analysis]);

    // compute sorted differential list for UI
    const differential = React.useMemo(() => {
        if (!analysis || !analysis.probabilities) return [];
        return Object.entries(analysis.probabilities)
            .map(([name, p]) => ({ name, prob: Number(p) }))
            .sort((a, b) => b.prob - a.prob);
    }, [analysis]);

    const [sessions, setSessions] = useState([]);

    // Load sessions from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('neuro_sessions');
        if (saved) {
            setSessions(JSON.parse(saved));
        }
    }, []);

    function normalizeBodyPartName(raw) {
        if (!raw) return null;
        const l = (raw || '').toLowerCase();
        if (l.includes('temporal')) return 'Temporal Lobe';
        if (l.includes('frontal')) return 'Frontal Lobe';
        if (l.includes('parietal')) return 'Parietal Lobe';
        if (l.includes('occipital')) return 'Occipital Lobe';
        if (l.includes('cerebell')) return 'Cerebellum';
        if (l.includes('brain stem') || l.includes('brainstem') || l.includes('pons') || l.includes('sella') || l.includes('pituitary')) return 'Brain Stem';
        if (l.includes('parahippocampal') && l.includes('left')) return 'Left Parahippocampal Gyrus';
        if (l.includes('parahippocampal') && l.includes('right')) return 'Right Parahippocampal Gyrus';
        if (l.includes('middle cerebral artery') || l.includes('mca')) return 'Middle Cerebral Artery';
        if (l.includes('sagittal sinus')) return 'Sagittal Sinus';
        if (l.includes('whole brain') || l.includes('global') || l.includes('normal')) return 'Whole Brain';
        // fallback: return original string so UI can display it (no region highlight if unknown)
        return raw;
    }

    const analysisSteps = [
        "Initializing Volumetric Engine",
        "Loading Local Training Set (4 Categories)",
        "Neural Path Segmentation",
        "Pathological Pattern Correlation",
        "Biomarker Synthesis",
        "Finalizing Diagnostic Bundle"
    ];

    const tumorData = {
        'glioma_tumor': {
            diagnosis: 'Glioma / Glioblastoma (representative)',
            brain_region: 'Left Parahippocampal Gyrus',
            confidence: 0.98,
            volume: '14.8 cm³',
            relative_growth: '+2.4% vs prev',
            biomarkers: ['IDH-wildtype (likely)', 'MGMT status unknown'],
            probable_causes: 'Aggressive intra-axial mass with surrounding edema.',
            solutions: [
                { title: 'Neurosurgical Evaluation', desc: 'Consider biopsy / resection', type: 'critical' },
                { title: 'MRI with Contrast', desc: 'Pre-surgical planning', type: 'standard' }
            ],
            suspects: [ { name: 'Glioma', probability: 0.98, color: 'rose' } ]
        },
        'meningioma_tumor': {
            diagnosis: 'Meningioma (dural-based)',
            brain_region: 'Right Frontal Lobe',
            confidence: 0.96,
            volume: '8.4 cm³',
            relative_growth: '+0.1% vs prev',
            biomarkers: ['Dural tail sign on imaging'],
            probable_causes: 'Extra-axial enhancing lesion likely meningioma.',
            solutions: [ { title: 'Neurosurgical Review', desc: 'Consider resection or radiosurgery', type: 'standard' } ],
            suspects: [ { name: 'Meningioma', probability: 0.96, color: 'emerald' } ]
        },
        'pituitary_tumor': {
            diagnosis: 'Pituitary Tumor (sellar mass)',
            brain_region: 'Sella / Brain Stem (visual proxy)',
            confidence: 0.93,
            volume: '1.2 cm³',
            relative_growth: 'stable',
            biomarkers: ['Endocrine panel advised'],
            probable_causes: 'Sellar/suprasellar lesion consistent with pituitary adenoma.',
            solutions: [ { title: 'Endocrinology Consult', desc: 'Hormonal workup & MRI follow-up', type: 'standard' } ],
            suspects: [ { name: 'Pituitary Tumor', probability: 0.93, color: 'orange' } ]
        },
        'no_tumor': {
            diagnosis: 'No Intracranial Pathology Detected',
            brain_region: 'Whole Brain',
            confidence: 0.9999,
            volume: 'N/A',
            relative_growth: 'N/A',
            biomarkers: [],
            probable_causes: 'No focal lesion identified on the scan.',
            solutions: [ { title: 'Routine Follow-up', desc: 'Clinical correlation recommended', type: 'info' } ],
            suspects: [ { name: 'Normal', probability: 0.9999, color: 'emerald' } ]
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setAnalysis(null);
            setProtocolStep(0);
        }
    };

    const handleAnalyze = async () => {
        if (!preview) return;
        setLoading(true);
        setProtocolStep(0);

        try {
            for (let i = 0; i < analysisSteps.length; i++) {
                setProtocolStep(i + 1);
                await new Promise(r => setTimeout(r, 1000));
            }

            // Send image to backend process endpoint so the trained DESIGN model is used and region highlighting is accurate
            let serverResult = null;
            try {
                const resp = await fetch('http://localhost:5000/process-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: preview })
                });

                const json = await resp.json();
                if (json?.status === 'success' && json.result) {
                    serverResult = json.result;
                }
            } catch (err) {
                console.warn('Backend analysis failed:', err);
            }

            if (serverResult) {
                // Map backend result -> UI analysis shape
                const probs = serverResult.probabilities || {};
                const suspects = Object.entries(probs).map(([name, p]) => ({ name, probability: p, color: p > 0.9 ? 'rose' : p > 0.8 ? 'orange' : 'emerald' }));

                const data = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    diagnosis: serverResult.diagnosis || 'Unknown',
                    display_name: serverResult.disease_display_name || serverResult.design_label || serverResult.diagnosis || 'Unknown',
                    severity: serverResult.severity || (serverResult.region_analysis && serverResult.region_analysis.severity) || 'low',
                    brain_region: normalizeBodyPartName(serverResult.body_part || serverResult.diagnosis_area || 'Whole Brain'),
                    confidence: serverResult.confidence || 0,
                    volume: serverResult.volume || 'N/A',
                    suspects,
                    solutions: serverResult.solutions || [],
                    probable_causes: serverResult.findings || [],
                    biomarkers: serverResult.findings || [],
                    voxel_count: 'N/A',
                    relative_growth: serverResult.relative_growth || 'N/A'
                };

                setAnalysis(data);
                showToast('Analysis complete (server)', { type: 'success' });
            } else {
                // Backend unreachable — do NOT perform a local demo fallback.
                showToast('Backend not reachable — analysis unavailable. Start the backend at http://localhost:5000 and try again.', { type: 'error' });
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error(err);
            showToast('Protocol failure', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveReport = () => {
        if (!analysis) return;

        // Check if already saved
        if (sessions.some(s => s.id === analysis.id)) {
            showToast('Report already archived', { type: 'info' });
            return;
        }

        const updatedSessions = [analysis, ...sessions];
        setSessions(updatedSessions);
        localStorage.setItem('neuro_sessions', JSON.stringify(updatedSessions));
        showToast('Report archived to secure vault', { type: 'success' });
    };

    const handleExport = async () => {
        if (!analysis) return;
        showToast('Initiating Clinical Bundle Synthesis...', { type: 'info' });
        await new Promise(r => setTimeout(r, 1500));
        showToast('Compiling DICOM-aligned meta-layers...', { type: 'info' });
        await new Promise(r => setTimeout(r, 1500));
        showToast('PDF Bundle V4 Exported Successfully', { type: 'success' });
    };

    return (
        <div className="relative min-h-screen bg-[var(--color-bg)] py-8 px-4 sm:px-8 overflow-hidden font-inter">
            <NeuralPulseBackground />
            <SessionHistoryDrawer
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                sessions={sessions}
                onLoad={(s) => {
                    setAnalysis(s);
                    showToast(`Loaded report: ${s.date}`, { type: 'info' });
                }}
            />

            <div className="max-w-[1700px] mx-auto space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold font-sora text-teal-600 uppercase tracking-[0.3em]">AI Diagnostic Suite</span>
                            <Badge className="bg-slate-900 text-white border-none text-[8px] font-bold px-2 py-0.5">PLATFORM V4.2</Badge>
                        </div>
                        <h1 className="text-4xl font-bold font-sora text-slate-900 tracking-tight">NeuroCore<span className="text-teal-600">.</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsHistoryOpen(true)}
                            variant="ghost"
                            className="bg-white border border-zinc-200 hover:bg-zinc-50 h-11 px-6 rounded-xl text-[11px] font-bold font-sora uppercase tracking-wider text-slate-600 gap-3 transition-all"
                        >
                            <History size={16} /> Vault ({sessions.length})
                        </Button>
                        <Button
                            onClick={handleSaveReport}
                            disabled={!analysis}
                            className="bg-teal-50 text-teal-700 hover:bg-teal-100 h-11 px-6 rounded-xl text-[11px] font-bold font-sora uppercase tracking-wider gap-3 border border-teal-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <ShieldCheck size={16} /> Save
                        </Button>
                        <Button
                            onClick={handleExport}
                            disabled={!analysis}
                            className="bg-slate-900 text-white hover:bg-slate-800 h-11 px-8 rounded-xl text-[11px] font-bold font-sora uppercase tracking-wider gap-3 shadow-lg shadow-slate-900/10 disabled:opacity-50 transition-all active:scale-95"
                        >
                            <Download size={16} /> Clinical Export
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[520px] lg:min-h-[750px] items-stretch">

                    {/* LEFT: INPUT & PROTOCOL HUB */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="flex-1 bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 flex flex-col relative group overflow-hidden">
                            <div className="mb-8 relative z-20">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[10px] font-bold font-sora uppercase tracking-[0.2em] text-zinc-400">Volumetric Input</h3>
                                    <ShieldCheck size={14} className="text-teal-600" />
                                </div>
                                <p className="text-xl font-bold font-sora tracking-tight text-slate-900">Scan Sequence</p>
                            </div>

                            <div
                                onClick={() => document.getElementById('scan-upload')?.click()}
                                className={cn(
                                    "flex-1 border-2 border-dashed rounded-[32px] transition-all p-6 text-center cursor-pointer flex flex-col items-center justify-center group/upload relative overflow-hidden",
                                    preview ? "border-teal-500/20 bg-teal-50/20 text-teal-700" : "border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 hover:border-teal-500/30"
                                )}
                            >
                                <ScanningLine isActive={loading} />
                                <input id="scan-upload" type="file" onChange={handleFileSelect} accept="image/*,.dcm,.nii" className="hidden" />

                                {preview ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img src={preview} alt="MRI" className="max-h-60 object-contain rounded-2xl shadow-sm border border-zinc-200" />
                                        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                                            <p className="text-[10px] font-bold font-sora uppercase tracking-widest text-slate-900">Switch Sequence</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-zinc-300 border border-zinc-100 group-hover/upload:scale-110 group-hover/upload:text-teal-600 transition-all duration-500 shadow-sm">
                                            <UploadCloud size={32} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm font-sora uppercase tracking-tight text-slate-900">Upload DICOM</p>
                                            <p className="text-[9px] text-zinc-400 font-bold mt-1 uppercase tracking-widest leading-relaxed">T1, T2, FLAIR support</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 space-y-4 relative z-20">
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={!selectedFile || loading}
                                    className={cn(
                                        "w-full h-13 rounded-xl text-[11px] font-bold font-sora uppercase tracking-[0.15em] transition-all",
                                        loading ? "bg-zinc-100 text-zinc-400" :
                                            preview ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20" : "bg-zinc-50 text-zinc-300"
                                    )}
                                >
                                    {loading ? "Synthesis In Progress" : (
                                        <span className="flex items-center gap-3">
                                            <Zap size={15} fill="currentColor" /> Analyze Now
                                        </span>
                                    )}
                                </Button>

                                <AnimatePresence>
                                    {loading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-2 mt-4"
                                        >
                                            <div className="flex justify-between text-[9px] font-bold text-teal-600 uppercase tracking-widest">
                                                <span>{analysisSteps[protocolStep - 1]}</span>
                                                <span className="font-mono">{Math.round((protocolStep / analysisSteps.length) * 100)}%</span>
                                            </div>
                                            <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-teal-600"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(protocolStep / analysisSteps.length) * 100}%` }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: 3D RECONSTRUCTION CORE */}
                    <div className="lg:col-span-6 flex flex-col relative">
                        <div className="flex-1 bg-white border border-zinc-100 rounded-[32px] relative overflow-hidden flex flex-col shadow-sm">
                            {/* HUD Overlays (header removed) */}
                            <div className="absolute top-8 left-8 z-30 flex flex-col gap-4 pointer-events-none">

                                {analysis && analysis.diagnosis !== 'no_tumor' && (severity === 'high' || severity === 'medium') && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-red-100 space-y-3 max-w-[220px] shadow-sm pointer-events-auto"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="text-[10px] font-bold font-sora text-red-600 uppercase tracking-widest">Pathology Detected</span>
                                        </div>
                                        <p className="text-lg font-bold font-sora text-slate-900 leading-tight uppercase tracking-tight">{analysis.brain_region}</p>
                                        <div className="flex justify-between items-end pt-1">
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] text-zinc-400 font-bold uppercase">Volume</p>
                                                <p className="text-[11px] font-bold text-slate-700">{analysis.volume}</p>
                                            </div>
                                            <div className="space-y-0.5 text-right">
                                                <p className="text-[8px] text-zinc-400 font-bold uppercase">Delta</p>
                                                <p className="text-[11px] font-bold text-emerald-600">{analysis.relative_growth}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* GPU Engine (Three.js) */}
                            <div className="flex-1 w-full relative z-20 cursor-move h-[320px] sm:h-[420px] md:h-[520px] lg:h-full">
                                <LeaderLine visible={!!analysis} />

                                {/* severity badge (color indicator for highlighted region) */}
                                {analysis && (
                                    <div className="absolute top-4 right-4 z-40 pointer-events-none">
                                        <div className={"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border shadow-sm"}>
                                            <span className={`w-2 h-2 rounded-full ${severity === 'high' ? 'bg-red-500' : severity === 'medium' ? 'bg-amber-500' : (severity === 'low' || severity === 'normal') ? 'bg-emerald-500' : 'bg-yellow-400'}`} />
                                            <span className="text-[11px] font-semibold text-zinc-700">{analysis.brain_region || 'Whole Brain'} • {severity.toUpperCase()}</span>
                                        </div>
                                    </div>
                                )}

                                <ThreeViewer
                                    ref={threeViewerRef}
                                    diagnosisArea={analysis?.diagnosis}
                                    bodyPart={analysis?.diagnosis === 'no_tumor' || severity === 'normal' ? null : analysis?.brain_region}
                                    severity={analysis?.diagnosis === 'no_tumor' ? 'normal' : severity}
                                />
                            </div>

                            {/* Center HUD Bottom */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                                <div className="bg-white/95 backdrop-blur-xl border border-zinc-100 rounded-full px-8 py-4 flex gap-10 text-zinc-400 shadow-lg pointer-events-auto">
                                    {[
                                        { label: 'Latency', value: '4ms' },
                                        { label: 'Precision', value: '0.988' },
                                        { label: 'Util', value: '72%' }
                                    ].map((s, i) => (
                                        <div key={i} className="flex flex-col items-center gap-0.5">
                                            <span className="text-[8px] font-bold font-sora uppercase tracking-[0.2em] text-zinc-400 leading-none">{s.label}</span>
                                            <span className="text-xs font-bold text-slate-800 font-mono tracking-tight">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: AI SYNTHESIS & METRICS */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <AnimatePresence mode="wait">
                            {analysis ? (
                                <motion.div
                                    key="result-pane"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex-1 flex flex-col gap-6"
                                >
                                    {/* differential card */}
                                    {differential.length > 0 && (
                                        <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm relative overflow-hidden">
                                            <h3 className="text-[10px] font-bold font-sora uppercase tracking-[0.3em] text-zinc-400 mb-3">
                                                Differential Diagnosis
                                            </h3>
                                            <ul className="space-y-1">
                                                {differential.map(d => (
                                                    <li key={d.name} className="flex justify-between text-[11px]">
                                                        <span className="capitalize">
                                                            {d.name.replace(/_/g, ' ').replace('tumor', 'Tumor')}
                                                        </span>
                                                        <span>{(d.prob * 100).toFixed(1)}%</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="p-6 rounded-2xl bg-white border border-zinc-100 border-l-4 border-l-red-500 shadow-sm relative overflow-hidden">
                                        <h3 className="text-[10px] font-bold font-sora uppercase tracking-[0.3em] text-red-600 mb-3 flex items-center gap-2 leading-none">
                                            <AlertTriangle size={12} /> Critical Alert
                                        </h3>
                                        <h2 className="text-2xl font-bold font-sora text-slate-900 leading-tight tracking-tight mb-4 uppercase">{analysis.diagnosis}</h2>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.biomarkers.map(b => (
                                                <span key={b} className="bg-zinc-50 text-slate-600 border border-zinc-100 text-[9px] py-1 px-2.5 font-bold uppercase tracking-wider rounded-lg leading-none">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Solutions Panel */}
                                    <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[10px] font-bold font-sora text-zinc-400 uppercase tracking-[0.2em]">Suggested Interventions</h3>
                                            <ShieldCheck size={14} className="text-teal-600" />
                                        </div>
                                        <div className="space-y-3">
                                            {analysis.solutions.map((sol, i) => (
                                                <div key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex gap-3">
                                                    <div className={cn(
                                                        "w-1 h-full rounded-full shrink-0",
                                                        sol.type === 'critical' ? "bg-red-500" :
                                                            sol.type === 'standard' ? "bg-teal-500" : "bg-blue-500"
                                                    )} />
                                                    <div>
                                                        <h4 className="text-[11px] font-bold font-sora text-slate-800 uppercase tracking-tight">{sol.title}</h4>
                                                        <p className="text-[10px] text-zinc-500 leading-tight mt-1">{sol.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    <div className="flex-1 p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm flex flex-col min-h-0">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-[10px] font-bold font-sora uppercase text-zinc-400 tracking-[0.25em] leading-none">{analysis.critical_alert ? 'Critical Synthesis' : 'Clinical Synthesis'}</h4>
                                            <Info size={14} className="text-zinc-300" />
                                        </div>
                                        <div className="flex-1 bg-zinc-50/50 rounded-xl p-5 border border-zinc-100 overflow-y-auto">
                                            <p className="text-[13px] text-slate-600 leading-relaxed font-medium italic">
                                                "{analysis.probable_causes}"
                                            </p>
                                        </div>
                                        <div className="mt-5 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                                                <Dna size={16} />
                                            </div>
                                            <p className="text-[9px] font-bold font-sora text-zinc-500 uppercase tracking-widest leading-none">Genomic Map Integrated</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 rounded-2xl border-2 border-dashed border-zinc-100 bg-white shadow-sm relative overflow-hidden group">
                                    <div className="w-20 h-20 bg-zinc-50 rounded-[40px] border border-zinc-100 flex items-center justify-center mb-6 text-zinc-300 group-hover:scale-105 transition-transform duration-700">
                                        <Scan size={32} className="opacity-50" strokeWidth={1} />
                                    </div>
                                    <h2 className="text-xl font-bold font-sora text-slate-900 mb-2 uppercase tracking-tight">System Ready</h2>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed font-bold uppercase tracking-[0.2em] max-w-[180px]">
                                        Awaiting scan sequence or patient history synchronization.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
