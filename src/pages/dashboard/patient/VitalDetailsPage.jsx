import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  Filter,
  Download,
  Plus,
  Info,
  ChevronLeft
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

export default function VitalDetailsPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const s = new URLSearchParams(search);
  const type = s.get('type') || 'Blood Pressure';
  const [timeRange, setTimeRange] = useState('7D');

  // Mock trend data for visualization
  const trendData = [40, 60, 45, 70, 55, 80, 65, 75, 50, 90];
  const history = [
    { date: 'Today, 09:12 AM', value: '120/80', unit: 'mmHg', status: 'normal', trend: 'stable' },
    { date: 'Yesterday, 08:30 PM', value: '122/82', unit: 'mmHg', status: 'normal', trend: 'up' },
    { date: 'Yesterday, 08:00 AM', value: '125/85', unit: 'mmHg', status: 'elevated', trend: 'up' },
    { date: '2 days ago', value: '118/78', unit: 'mmHg', status: 'normal', trend: 'down' },
    { date: '3 days ago', value: '121/81', unit: 'mmHg', status: 'normal', trend: 'stable' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title={type}
          subtitle={`Comprehensive history and trend analysis for your ${type.toLowerCase()}.`}
          showBack={true}
        />
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="rounded-xl border border-zinc-200 bg-white/50 text-xs font-bold gap-2">
            <Download size={14} /> Export PDF
          </Button>
          <Button className="bg-black text-white hover:bg-zinc-800 rounded-xl px-4 py-2 font-bold text-xs shadow-lg flex items-center gap-2">
            <Plus size={14} /> Log Entry
          </Button>
        </div>
      </div>

      {/* Main Visualization Card */}
      <GlassCard className="p-8 relative overflow-hidden">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Current Reading</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">120/80</h2>
              <span className="text-lg font-bold text-slate-400">mmHg</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] uppercase font-bold tracking-widest px-2.5">Normal</Badge>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Clock size={12} /> Measured 2 hours ago
              </span>
            </div>
          </div>

          <div className="flex p-1 bg-zinc-100/50 rounded-xl border border-zinc-200/50">
            {['24H', '7D', '30D', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  timeRange === range ? "bg-white text-black shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Trend Line (Mockup) */}
        <div className="h-64 w-full relative group">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 100 ${trendData.map((v, i) => `L ${(i / (trendData.length - 1)) * 100} ${100 - v}`).join(' ')} L 100 100 Z`}
              fill="url(#gradient)"
            />
            <path
              d={trendData.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (trendData.length - 1)) * 100} ${100 - v}`).join(' ')}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data Points */}
            {trendData.map((v, i) => (
              <circle
                key={i}
                cx={(i / (trendData.length - 1)) * 100}
                cy={100 - v}
                r="1"
                fill="white"
                stroke="var(--color-accent)"
                strokeWidth="0.5"
                className="hover:r-2 transition-all cursor-pointer"
              />
            ))}
          </svg>

          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-slate-300 pointer-events-none">
            <span>140</span>
            <span>120</span>
            <span>100</span>
            <span>80</span>
            <span>60</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest pt-6 border-t border-zinc-100/50">
          <span>{timeRange === '7D' ? 'Jun 05' : 'Start'}</span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
            Average: 122/81
          </span>
          <span>Today</span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Grid */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-2">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-4">
              <ArrowUpRight size={18} className="text-red-500 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Highest</p>
              <p className="text-xl font-black text-slate-900">132/88</p>
            </GlassCard>
            <GlassCard className="p-4">
              <ArrowDownRight size={18} className="text-emerald-500 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Lowest</p>
              <p className="text-xl font-black text-slate-900">114/76</p>
            </GlassCard>
            <GlassCard className="p-4 col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Last 30 Days</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">Slightly elevated vs previous</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-amber-500">+4%</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-5 bg-zinc-900 border-none">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Info size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Doctor's Note</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  "Continue monitoring twice daily. Current readings show positive response to medication adjustments."
                </p>
                <p className="text-[10px] text-zinc-500 mt-2 font-bold">— DR. SARAH JOHNSON</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Reading History</h3>
            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase gap-2">
              <Filter size={12} /> Filter
            </Button>
          </div>
          <GlassCard className="overflow-hidden shadow-sm">
            <div className="divide-y divide-zinc-100">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      h.status === 'normal' ? "bg-emerald-500" : "bg-amber-500"
                    )}></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{h.value} <span className="text-xs font-medium text-slate-400">{h.unit}</span></p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{h.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <Badge variant="secondary" className={cn(
                        "text-[9px] font-bold uppercase tracking-widest h-5 px-1.5",
                        h.status === 'normal' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>{h.status}</Badge>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-50",
                      h.trend === 'up' ? "text-amber-500" : h.trend === 'down' ? "text-emerald-500" : "text-slate-300"
                    )}>
                      {h.trend === 'up' ? <ArrowUpRight size={16} /> : h.trend === 'down' ? <ArrowDownRight size={16} /> : <div className="w-3 h-0.5 bg-current rounded-full" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black hover:bg-zinc-50 transition-all border-t border-zinc-100">
              Load Older Records
            </button>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
