import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Building2,
  FlaskConical,
  ChevronRight,
  History,
  Info,
  MoreHorizontal
} from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

const AccessEntity = ({ name, type, description, granted, onToggle, trustScore }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-white/40 transition-all group">
    <div className="flex gap-4 mb-4 sm:mb-0">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
        granted ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-400"
      )}>
        {type === 'Hospital' ? <Building2 size={24} /> : <FlaskConical size={24} />}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-slate-900">{name}</h4>
          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest h-4 px-1.5 border-zinc-200 text-zinc-400">
            {type}
          </Badge>
        </div>
        <p className="text-xs text-slate-500 font-medium max-w-sm">{description}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={cn("w-1 h-1 rounded-full", s <= trustScore ? "bg-emerald-400" : "bg-zinc-200")} />
              ))}
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Trust Level</span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
      <div className="flex flex-col items-end mr-2">
        <p className={cn(
          "text-[10px] font-bold uppercase tracking-widest mb-1",
          granted ? "text-emerald-500" : "text-zinc-400"
        )}>
          {granted ? 'Granted' : 'Revoked'}
        </p>
        <p className="text-[9px] text-slate-400 font-medium italic">
          {granted ? 'Can view latest records' : 'No access to data'}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "w-14 h-7 rounded-full relative transition-all duration-500 ease-in-out border-2",
          granted ? "bg-emerald-500 border-emerald-500" : "bg-zinc-200 border-zinc-200"
        )}
      >
        <motion.div
          animate={{ x: granted ? 28 : 2 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          {granted ? <Unlock size={10} className="text-emerald-500" /> : <Lock size={10} className="text-zinc-400" />}
        </motion.div>
      </button>
    </div>
  </div>
);

export default function ManageAccessPage() {
  const [access, setAccess] = useState({
    "St. Mary's General": { granted: true, type: 'Hospital', desc: 'Primary care facility and emergency trauma center.', trust: 5 },
    "Neurology Research Lab": { granted: false, type: 'Research', desc: 'Non-profit institution studying synaptic patterns.', trust: 4 },
    "Global Pharma Solutions": { granted: false, type: 'Commercial', desc: 'Third-party drug efficacy study group.', trust: 2 }
  });
  const { showToast } = useToast();

  const toggle = (k) => {
    const newState = !access[k].granted;
    setAccess(prev => ({
      ...prev,
      [k]: { ...prev[k], granted: newState }
    }));
    showToast(`${k} access ${newState ? 'granted' : 'revoked'}`, { type: newState ? 'success' : 'info' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Data Access Control"
          subtitle="Monitor and manage which institutions have permission to view your medical history."
          showBack={true}
        />
        <Button variant="ghost" className="rounded-xl border border-zinc-200 bg-white/50 text-xs font-bold gap-2 h-10 px-4">
          <History size={14} /> Audit Logs
        </Button>
      </div>

      <GlassCard className="p-8 bg-zinc-900 border-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] opacity-5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <ShieldCheck size={40} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-white mb-2">Security Shield Active</h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              Your records are end-to-end encrypted. No entity can access your sensitive data without your explicit cryptographic authorization.
            </p>
          </div>
          <Button className="bg-white text-black hover:bg-zinc-100 rounded-xl px-6 font-black text-xs uppercase tracking-widest">
            Verify Identity
          </Button>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authorized Entities</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-accent)] cursor-pointer hover:underline">
            <Info size={12} /> Privacy Policy
          </div>
        </div>

        <GlassCard className="overflow-hidden divide-y divide-zinc-100/50 p-0">
          {Object.entries(access).map(([name, data]) => (
            <AccessEntity
              key={name}
              name={name}
              type={data.type}
              description={data.desc}
              granted={data.granted}
              trustScore={data.trust}
              onToggle={() => toggle(name)}
            />
          ))}
          <div className="p-6 bg-zinc-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 italic">
              <ShieldAlert size={14} /> Only grant access to trusted institutions
            </div>
            <Button
              className="bg-black text-white hover:bg-zinc-800 rounded-xl px-8 h-10 font-bold shadow-lg"
              onClick={() => showToast('Configuration synchronized', { type: 'success' })}
            >
              Sync Preferences
            </Button>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-dashed border-2 border-zinc-200 bg-transparent shadow-none hover:bg-white/50 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 size={20} />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button>
          </div>
          <h4 className="font-bold text-slate-800 mb-1">Add New Hospital</h4>
          <p className="text-xs text-slate-500">Scan QR code or enter facility ID to grant medical access.</p>
        </GlassCard>

        <GlassCard className="p-6 border-dashed border-2 border-zinc-200 bg-transparent shadow-none hover:bg-white/50 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock size={20} />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button>
          </div>
          <h4 className="font-bold text-slate-800 mb-1">Emergency Override</h4>
          <p className="text-xs text-slate-500">Pre-authorize trauma centers for time-critical emergencies.</p>
        </GlassCard>
      </div>
    </motion.div>
  );
}

