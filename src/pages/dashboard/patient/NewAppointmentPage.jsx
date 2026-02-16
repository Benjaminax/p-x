import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Stethoscope, Video, MapPin, ChevronRight, Check, Activity, Brain, Heart, Bone } from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { cn } from '../../../lib/utils';

// Mock Data
const DEPARTMENTS = [
  { id: 'cardio', name: 'Cardiology', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', description: 'Heart health & surgery' },
  { id: 'neuro', name: 'Neurology', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', description: 'Brain & nervous system' },
  { id: 'general', name: 'General Practice', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Routine checkups' },
  { id: 'ortho', name: 'Orthopedics', icon: Bone, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Bones & joints' },
];

const DOCTORS = {
  cardio: [
    { id: 'dr-sarah', name: 'Dr. Sarah Johnson', role: 'Senior Cardiologist' },
    { id: 'dr-mike', name: 'Dr. Mike Chen', role: 'Cardiothoracic Surgeon' },
  ],
  neuro: [
    { id: 'dr-emily', name: 'Dr. Emily Wong', role: 'Neurologist' },
    { id: 'dr-alan', name: 'Dr. Alan Grant', role: 'Neurosurgeon' },
  ],
  general: [
    { id: 'dr-james', name: 'Dr. James Wilson', role: 'Family Physician' },
    { id: 'dr-lisa', name: 'Dr. Lisa Cuddy', role: 'General Practitioner' },
  ],
  ortho: [
    { id: 'dr-greg', name: 'Dr. Gregory House', role: 'Diagnostician' },
  ]
};

export default function NewAppointmentPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('In-person');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newAppointment = {
        doctor: DOCTORS[department]?.find(d => d.id === doctor)?.name || 'Unknown Doctor',
        specialty: DEPARTMENTS.find(d => d.id === department)?.name,
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        time,
        type,
        status: 'upcoming'
      };

      const current = JSON.parse(localStorage.getItem('upcomingAppointments') || '[]');
      localStorage.setItem('upcomingAppointments', JSON.stringify([newAppointment, ...current]));

      setLoading(false);
      showToast('Appointment Request Confirmed', { type: 'success' });
      navigate('/dashboard/patient/appointments');
    }, 1500);
  };

  return (
    <div className="relative max-w-5xl mx-auto space-y-8 min-h-[600px]">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      <PageHeader
        title="Book an Appointment"
        subtitle="Schedule a visit with our world-class specialists."
        showBack={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Steps Sidebar - Glass Style */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="p-6 border-[var(--color-border)] bg-[var(--color-surface-glass)]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-6">Booking Steps</h3>
            <div className="space-y-6 relative">
              {/* Vertical connecting line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[var(--color-border)] -z-10"></div>

              {[
                { num: 1, title: 'Department', desc: 'Medical Specialty', active: step >= 1 },
                { num: 2, title: 'Specialist', desc: 'Choose Doctor', active: step >= 2 },
                { num: 3, title: 'Details', desc: 'Time & Reason', active: step >= 3 },
              ].map((s) => (
                <div key={s.num} className="flex items-start gap-4 transition-all relative">
                  <div className="relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-[var(--color-surface)] transition-all duration-300 relative z-10",
                      step === s.num ? 'bg-[var(--color-accent)] text-[var(--color-background)] scale-110 shadow-lg shadow-black/20' :
                        step > s.num ? 'bg-[var(--color-accent)] text-[var(--color-background)]' : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
                    )}>
                      {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    {step === s.num && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute inset-0 bg-[var(--color-accent)] rounded-full -z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                  <div className={`transition-opacity duration-300 ${s.active ? 'opacity-100 translate-x-0' : 'opacity-50'}`}>
                    <div className={cn("font-bold text-base", s.active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]")}>{s.title}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Dynamic Help Card based on Step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-500">
                {step === 1 && "💡 Tip: Not sure which department? Select 'General Practice' for an initial triage consultation."}
                {step === 2 && "💡 Drs marked as 'Senior' may have longer wait times."}
                {step === 3 && "💡 Virtual calls are hosted directly within this dashboard via the 'Meeting' tab."}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main Form Area */}
        <GlassCard className="lg:col-span-8 p-8 min-h-[500px] flex flex-col justify-between border-[var(--color-border)] shadow-xl shadow-black/5 backdrop-blur-xl bg-[var(--color-surface-glass)]">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-[var(--color-text-primary)]">Select Department</h3>
                    <p className="text-[var(--color-text-secondary)]">What type of care do you need today?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DEPARTMENTS.map((dept) => (
                      <div
                        key={dept.id}
                        onClick={() => setDepartment(dept.id)}
                        className={cn(
                          "group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                          department === dept.id
                            ? 'border-[var(--color-accent)] bg-[var(--color-surface-hover)] shadow-md ring-1 ring-black/5'
                            : 'border-transparent bg-[var(--color-surface)] hover:border-[var(--color-border-hover)]'
                        )}
                      >
                        <div className={`w-12 h-12 rounded-xl ${dept.bg} ${dept.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                          <dept.icon className="w-6 h-6" />
                        </div>
                        <div className="font-bold text-[var(--color-text-primary)] text-lg mb-1">{dept.name}</div>
                        <div className="text-sm text-[var(--color-text-secondary)] font-medium">{dept.description}</div>

                        {department === dept.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-[var(--color-accent)] rounded-full flex items-center justify-center animate-in zoom-in spin-in-90 duration-300">
                            <Check className="w-3 h-3 text-[var(--color-background)]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-[var(--color-text-primary)]">Choose Specialist</h3>
                    <p className="text-[var(--color-text-secondary)]">Available doctors in <span className="text-[var(--color-accent)] font-semibold">{DEPARTMENTS.find(d => d.id === department)?.name}</span></p>
                  </div>

                  <div className="space-y-3">
                    {DOCTORS[department]?.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setDoctor(doc.id)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:shadow-sm hover:border-[var(--color-border-hover)]",
                          doctor === doc.id ? 'border-[var(--color-accent)] bg-[var(--color-surface-hover)] shadow-md' : 'border-transparent bg-[var(--color-surface)]'
                        )}
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-surface-hover)] to-[var(--color-border)] rounded-full flex items-center justify-center font-bold text-[var(--color-text-muted)] text-xl border-2 border-[var(--color-border)] shadow-sm">
                          {doc.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--color-text-primary)] text-lg">{doc.name}</div>
                          <div className="text-sm text-[var(--color-text-secondary)] font-medium flex items-center gap-2">
                            <Stethoscope className="w-3 h-3" /> {doc.role}
                          </div>
                        </div>
                        <div className="ml-auto">
                          {doctor === doc.id ? (
                            <div className="px-3 py-1 bg-[var(--color-accent)] text-[var(--color-background)] text-xs font-bold rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Selected
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-[var(--color-text-muted)]">Select</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-[var(--color-text-primary)]">Final Details</h3>
                    <p className="text-[var(--color-text-secondary)]">When should we schedule this?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" /> Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all hover:border-[var(--color-border-hover)] font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" /> Preferred Time
                      </label>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all hover:border-[var(--color-border-hover)] font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-primary)]">Visit Type</label>
                    <div className="flex gap-4">
                      {[
                        { val: 'In-person', icon: MapPin, desc: 'Visit Hospital' },
                        { val: 'Virtual', icon: Video, desc: 'Online Call' }
                      ].map((t) => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setType(t.val)}
                          className={cn(
                            "flex-1 py-4 px-4 rounded-xl border-2 text-left transition-all",
                            type === t.val
                              ? 'bg-[var(--color-accent)] text-[var(--color-background)] border-[var(--color-accent)] shadow-lg shadow-black/10'
                              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]'
                          )}
                        >
                          <t.icon className={cn("w-5 h-5 mb-2", type === t.val ? "text-[var(--color-background)]" : "text-[var(--color-text-muted)]")} />
                          <div className="font-bold">{t.val}</div>
                          <div className={cn("text-xs mt-1", type === t.val ? "opacity-80" : "text-[var(--color-text-muted)]")}>{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-text-primary)]">Reason for Visit</label>
                    <textarea
                      placeholder="Briefly describe your symptoms..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-4 bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 min-h-[100px] transition-all hover:border-[var(--color-border-hover)] resize-none font-medium text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between pt-6 border-t border-[var(--color-border)]">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="rounded-full px-6">
                  Back
                </Button>
              ) : <div></div>}

              {step < 3 ? (
                <Button
                  type="button"
                  className="bg-[var(--color-accent)] text-[var(--color-background)] hover:opacity-90 rounded-full px-8 h-12 text-base shadow-xl shadow-black/10"
                  disabled={step === 1 ? !department : !doctor}
                  onClick={() => setStep(s => s + 1)}
                >
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-[var(--color-accent)] text-[var(--color-background)] hover:opacity-90 rounded-full px-8 h-12 text-base shadow-xl shadow-black/20"
                  disabled={!date || !time}
                  isLoading={loading}
                >
                  Confirm <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
