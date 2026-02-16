import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Pill,
  RotateCcw,
  FileText,
  Clock,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';

const MedicationCard = ({ med, dose, frequency, doctor, refills, status, lastFilled }) => {
  const statusColors = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    renewal: "bg-blue-50 text-blue-600 border-blue-100",
    expired: "bg-slate-50 text-slate-500 border-slate-100"
  };

  return (
    <GlassCard className="p-6 hover:shadow-xl transition-all group overflow-hidden relative">
      {status === 'renewal' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] rounded-full -mr-12 -mt-12"></div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Icon & Primary Info */}
        <div className="flex-1 flex gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110",
            status === 'active' ? "bg-emerald-50 text-emerald-600" :
              status === 'renewal' ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-400"
          )}>
            <Pill size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-slate-900">{med}</h3>
              <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-widest", statusColors[status])}>
                {status}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-slate-500">{dose} • {frequency}</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <User size={12} /> Dr. {doctor}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <RotateCcw size={12} /> {refills} Refills Left
              </div>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="md:w-48 flex flex-col justify-between items-end gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Filled</p>
            <p className="text-sm font-bold text-slate-700">{lastFilled}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100">
              <Info size={18} className="text-zinc-500" />
            </Button>
            <Button className={cn(
              "flex-1 md:flex-none px-4 rounded-xl font-bold text-xs h-9 transition-all active:scale-95",
              status === 'renewal'
                ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            )}>
              {status === 'renewal' ? 'Request Refill' : 'View Details'}
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default function PrescriptionsPage() {
  const { showToast } = useToast();
  const prescriptions = [
    {
      med: 'Amoxicillin',
      dose: '500mg',
      frequency: 'Three times daily',
      doctor: 'Sarah Johnson',
      refills: 0,
      status: 'renewal',
      lastFilled: 'May 10, 2024'
    },
    {
      med: 'Lisinopril',
      dose: '10mg',
      frequency: 'Once daily',
      doctor: 'Michael Chen',
      refills: 2,
      status: 'active',
      lastFilled: 'Jun 02, 2024'
    },
    {
      med: 'Atorvastatin',
      dose: '20mg',
      frequency: 'Every evening',
      doctor: 'Emma Wilson',
      refills: 3,
      status: 'active',
      lastFilled: 'May 28, 2024'
    },
    {
      med: 'Metformin',
      dose: '850mg',
      frequency: 'Twice daily',
      doctor: 'Robert Glass',
      refills: 0,
      status: 'expired',
      lastFilled: 'Feb 15, 2024'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Prescriptions"
          subtitle="Track active medications, manage refills, and view prescribing instructions."
          showBack={true}
        />
        <Button className="bg-black text-white hover:bg-zinc-800 rounded-2xl px-6 py-6 font-bold shadow-xl flex items-center gap-2 group">
          <CheckCircle2 size={18} className="group-hover:rotate-12 transition-transform" />
          New Prescription
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active', value: '2', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Pending Refill', value: '1', icon: RotateCcw, color: 'text-blue-500' },
          { label: 'Expiring Soon', value: '0', icon: Clock, color: 'text-amber-500' },
          { label: 'Expired', value: '1', icon: AlertCircle, color: 'text-slate-400' }
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
            </div>
            <stat.icon className={cn("w-6 h-6", stat.color)} strokeWidth={3} />
          </GlassCard>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Current Medications</h2>
          <button className="text-xs font-bold text-[var(--color-accent)] hover:underline">View History</button>
        </div>
        <div className="grid gap-4">
          {prescriptions.map((p, i) => (
            <MedicationCard key={i} {...p} />
          ))}
        </div>
      </div>

      {/* Quick Actions / Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-6 bg-blue-50/30 border-blue-100/50 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Refill Policy</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Refill requests usually take 24-48 business hours to process by your physician.
                We will notify you as soon as the pharmacy receives the electronic authorization.
              </p>
            </div>
          </GlassCard>
        </div>
        <GlassCard className="p-6 flex flex-col justify-center items-center text-center border-dashed border-2 border-zinc-200 bg-transparent shadow-none hover:bg-white/50 transition-colors cursor-pointer group">
          <Calendar size={32} className="text-zinc-300 mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-bold text-slate-400">Schedule Medication<br />Review</p>
        </GlassCard>
      </div>
    </motion.div>
  );
}

const cn = (...classes) => classes.filter(Boolean).join(' ');

