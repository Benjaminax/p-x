import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Heart, Thermometer, Droplets,
  ArrowLeft, Calendar, FileText, Pill,
  Plus, MoreHorizontal, ShieldAlert,
  History, ExternalLink, Download,
  Zap, ClipboardList, Target, User,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('history');

  // Mock patient data for the ID
  const patient = {
    name: "Michael Brown",
    id: id || "PX-2026-9912",
    age: 42,
    gender: "Male",
    bloodGroup: "B+",
    genotype: "AA",
    weight: "78kg",
    height: "182cm",
    lastVisit: "28 Jan 2026",
    condition: "Chronic Migraine / Hypertension",
    emergencyContact: "+1 (555) 012-3456"
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Clinical Identity Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">{patient.name}</h1>
              <Badge className="bg-slate-100 text-slate-500 border-0 font-bold uppercase tracking-wider px-3">
                {patient.id}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
              <span>{patient.age}Y • {patient.gender}</span>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-rose-500" /> {patient.condition}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-slate-200 px-6 h-14 font-bold text-slate-600">
            <Download className="w-4 h-4 mr-2" /> Medical History PDF
          </Button>
          <Button className="rounded-2xl bg-black text-white hover:bg-slate-900 px-8 h-14 font-bold shadow-xl shadow-slate-200">
            <Plus className="w-4 h-4 mr-2" /> Start Consultation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Health Profile & Vitals (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-8 border-slate-100 bg-white shadow-sm rounded-[2.5rem]">
            <h3 className="font-bold text-xl mb-8 flex items-center justify-between">
              Biometric vitals
              <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold">Stable</Badge>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Blood Pressure", val: "118/72", unit: "mmHg", icon: Droplets, color: "text-rose-500", trend: "stable" },
                { label: "Heart Rate", val: "72", unit: "bpm", icon: Heart, color: "text-rose-500", trend: "up" },
                { label: "Body Temp", val: "36.8", unit: "°C", icon: Thermometer, color: "text-amber-500", trend: "stable" },
                { label: "Spo2", val: "99", unit: "%", icon: Activity, color: "text-blue-500", trend: "up" }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-slate-50/50 rounded-3xl border border-slate-50 group hover:border-slate-100 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-rose-500" />}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-0.5">{stat.val}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label} ({stat.unit})</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Patient Profile</h4>
              <div className="space-y-4">
                {[
                  { label: "Blood Group", val: patient.bloodGroup },
                  { label: "Genotype", val: patient.genotype },
                  { label: "Height / Weight", val: `${patient.height} / ${patient.weight}` },
                  { label: "Emergency", val: patient.emergencyContact }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-400">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <Card className="p-8 border-0 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700" />
            <Zap className="w-8 h-8 mb-6 text-blue-400" />
            <h4 className="text-xl font-bold mb-2 tracking-tight">AI Diagnostics Insight</h4>
            <p className="text-[10px] text-white/40 mb-10 leading-relaxed font-bold uppercase tracking-widest">NeuroScan Processing</p>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
              <p className="text-xs text-white/80 leading-relaxed italic">"Potential cortical thickening observed in the left temporal lobe. Correlate with migraine symptoms."</p>
            </div>

            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold py-6">
              View MRI Analysis
            </Button>
          </Card>
        </div>

        {/* Right Column: Longitudinal Tracking & Records (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl w-fit">
            {[
              { id: 'history', label: 'Clinical History', icon: History },
              { id: 'labs', label: 'Imaging & Labs', icon: FileText },
              { id: 'treatment', label: 'Treatment Plan', icon: Pill }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-8 border-slate-100 bg-white shadow-sm rounded-[2.5rem] min-h-[500px]">
                {activeTab === 'history' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-slate-900">Recent consultations</h3>
                      <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:text-blue-700">View All Archive</Button>
                    </div>

                    <div className="space-y-6">
                      {[
                        { date: "28 Jan 2026", type: "Follow-up", dr: "Dr. Smith", summary: "Patient reports increased frequency of migraines. Vitals stable. Adjusting medication.", tags: ["Hypertension", "Migraine"] },
                        { date: "12 Jan 2026", type: "Consultation", dr: "Dr. Adebayo", summary: "Initial assessment for chronic headache. MRI scan ordered for neuro evaluation.", tags: ["Neurology"] }
                      ].map((visit, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/20 group hover:border-blue-100 hover:bg-white transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-white shadow-sm rounded-xl border border-slate-50"><Calendar className="w-4 h-4 text-slate-400" /></div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{visit.type}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{visit.date} • {visit.dr}</p>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              {visit.tags.map(tag => <Badge key={tag} className="bg-blue-50 text-blue-600 border-0 font-bold text-[10px]">{tag}</Badge>)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed mb-6">{visit.summary}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                              <span className="flex items-center gap-1.5 hover:text-slate-600 cursor-pointer"><FileText className="w-3.5 h-3.5" /> Full Summary</span>
                              <span className="flex items-center gap-1.5 hover:text-slate-600 cursor-pointer"><ClipboardList className="w-3.5 h-3.5" /> Prescriptions</span>
                            </div>
                            <Button variant="ghost" size="sm" className="p-2"><MoreHorizontal className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'treatment' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-slate-900">Active Treatment Plan</h3>
                      <Badge className="bg-emerald-100 text-emerald-600 border-0 font-bold">On Track</Badge>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: "Sumatriptan Succinate", dosage: "50mg", schedule: "PRN (As needed)", progress: 65, color: "blue" },
                        { name: "Lisinopril", dosage: "10mg", schedule: "Once Daily (Morning)", progress: 92, color: "emerald" }
                      ].map((med, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-white">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 bg-${med.color}-50 rounded-2xl`}><Pill className={`w-6 h-6 text-${med.color}-600`} /></div>
                              <div>
                                <h4 className="font-bold text-lg text-slate-900">{med.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.dosage} • {med.schedule}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-slate-900">{med.progress}%</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adherence</p>
                            </div>
                          </div>
                          <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${med.progress}%` }}
                              className={`h-full bg-${med.color}-500`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center py-12">
                      <div className="p-4 bg-slate-50 rounded-full mb-4"><Plus className="w-6 h-6 text-slate-400" /></div>
                      <h4 className="font-bold text-slate-900 mb-1">Add Therapy or Medication</h4>
                      <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mb-6">Create a new intervention for this patient's treatment course.</p>
                      <Button className="bg-slate-900 text-white hover:bg-black rounded-xl font-bold px-8">Define Intervention</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'labs' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-slate-900">Medical Imaging & Lab results</h3>
                      <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-xs"><Plus className="w-3 h-3 mr-2" /> Upload Results</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { title: "Cranial MRI - T1/T2", date: "10 Jan 2026", result: "Anomaly Detected", desc: "Scan highlights potential areas of concern in temporal region.", color: "rose", type: "Imaging" },
                        { title: "Full Blood Count", date: "15 Jan 2026", result: "Normal", desc: "All metrics within clinical reference range.", color: "emerald", type: "Lab" }
                      ].map((lab, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-white group hover:shadow-xl hover:shadow-slate-100 transition-all">
                          <div className="flex justify-between items-start mb-6">
                            <Badge className={`bg-${lab.color}-50 text-${lab.color}-500 border-0 font-bold uppercase tracking-wider text-[10px]`}>{lab.type}</Badge>
                            <Button variant="ghost" size="sm" className="p-2"><ExternalLink className="w-4 h-4 text-slate-400" /></Button>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-1">{lab.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{lab.date} • {lab.result}</p>
                          <p className="text-xs text-slate-500 leading-relaxed mb-6">{lab.desc}</p>
                          <Button variant="outline" className="w-full border-slate-100 text-slate-600 font-bold text-xs h-10 rounded-xl">View Details</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
