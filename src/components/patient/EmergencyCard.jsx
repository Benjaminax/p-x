import { motion } from 'framer-motion';
import { ShieldAlert, Phone, Droplets, AlertTriangle, ShieldCheck, Download, Share2 } from 'lucide-react';

const EmergencyCard = ({ data = {} }) => {
    const {
        fullName = "Patient Name",
        bloodGroup = "O+",
        genotype = "AA",
        allergies = "No known allergies",
        emergencyContact = "+1 (555) 000-0000",
        patientId = "PX-2026-9932"
    } = data;

    return (
        <div className="w-full max-w-sm mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200 border border-slate-100"
            >
                {/* Red Alert Header */}
                <div className="bg-red-600 px-8 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 fill-white/20" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Medical Emergency ID</span>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>

                <div className="p-8 space-y-8">
                    {/* ID & Photo Section */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{fullName}</h2>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Patient ID: {patientId}</p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-slate-200" />
                        </div>
                    </div>

                    {/* Vital Specs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-3xl bg-blue-50/50 border border-blue-100/50">
                            <div className="flex items-center gap-2 mb-1">
                                <Droplets className="w-4 h-4 text-blue-600" />
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Blood Type</span>
                            </div>
                            <div className="text-xl font-bold text-blue-900">{bloodGroup}</div>
                        </div>
                        <div className="p-4 rounded-3xl bg-purple-50/50 border border-purple-100/50">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-4 h-4 text-purple-600" />
                                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Genotype</span>
                            </div>
                            <div className="text-xl font-bold text-purple-900">{genotype}</div>
                        </div>
                    </div>

                    {/* Allergy Alert */}
                    <div className="p-5 rounded-3xl bg-red-50 border border-red-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <AlertTriangle className="w-12 h-12 text-red-600" />
                        </div>
                        <div className="text-[10px] font-bold text-red-600 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Critical Allergies
                        </div>
                        <p className="text-sm font-semibold text-red-900 leading-relaxed">
                            {allergies}
                        </p>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">ICE: In Case of Emergency</div>
                        <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/10">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="font-semibold tracking-wide">{emergencyContact}</span>
                            </div>
                            <div className="text-[10px] font-bold text-white/40 uppercase">Call Now</div>
                        </div>
                    </div>

                    {/* QR Placeholder */}
                    <div className="pt-4 flex flex-col items-center gap-4">
                        <div className="p-3 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                                <ShieldCheck className="w-10 h-10 text-slate-200" />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center font-medium max-w-[200px]">
                            Scan to access full digital health records & encryption keys
                        </p>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6">
                    <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                        <Download className="w-4 h-4" /> Save PDF
                    </button>
                    <div className="w-px h-4 bg-slate-200" />
                    <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                        <Share2 className="w-4 h-4" /> Share Access
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Internal Activity icon if not imported correctly
const Activity = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default EmergencyCard;
