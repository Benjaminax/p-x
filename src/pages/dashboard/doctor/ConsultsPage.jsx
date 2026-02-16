import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Video, Phone, FileText, Calendar, User, Clock } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';

const ConsultCard = ({ patient, type, time, status, notes, onJoin }) => (
    <GlassCard className="p-6 hover:shadow-md transition-shadow border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-500 transition-transform hover:scale-110">
                    {patient.charAt(0)}
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">{patient}</h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{time}</span>
                    </div>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                status === 'scheduled' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
                }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
            {type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            <span>{type === 'video' ? 'Video Consultation' : 'Phone Consultation'}</span>
        </div>

        {notes && (
            <div className="bg-[var(--color-surface-hover)] rounded-lg p-3 mb-4 border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]"><strong>Reason:</strong> {notes}</p>
            </div>
        )}

        <div className="flex gap-2">
            {status === 'active' && (
                <Button onClick={onJoin} className="flex-1">
                    <Video className="w-4 h-4 mr-2" />
                    Join Consultation
                </Button>
            )}
            {status === 'scheduled' && (
                <>
                    <Button variant="secondary" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Reschedule
                    </Button>
                    <Button className="flex-1">
                        <Video className="w-4 h-4 mr-2" />
                        Start Early
                    </Button>
                </>
            )}
            {status === 'completed' && (
                <Button variant="secondary" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    View Notes
                </Button>
            )}
        </div>
    </GlassCard>
);

const ConsultsPage = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const consults = [
        {
            id: 1,
            patient: 'Jane Doe',
            type: 'video',
            time: 'Today, 2:00 PM',
            status: 'active',
            notes: 'Follow-up for blood pressure management'
        },
        {
            id: 2,
            patient: 'John Smith',
            type: 'video',
            time: 'Today, 3:30 PM',
            status: 'scheduled',
            notes: 'Initial consultation for persistent headaches'
        },
        {
            id: 3,
            patient: 'Mary Johnson',
            type: 'phone',
            time: 'Today, 4:00 PM',
            status: 'scheduled',
            notes: 'Prescription refill discussion'
        },
        {
            id: 4,
            patient: 'Robert Williams',
            type: 'video',
            time: 'Yesterday, 11:00 AM',
            status: 'completed',
            notes: 'Annual check-up'
        },
    ];

    const filteredConsults = filter === 'all'
        ? consults
        : consults.filter(c => c.status === filter);

    const handleJoinConsult = (consultId) => {
        showToast('Joining consultation...', { type: 'info' });
        navigate('/meeting');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <PageHeader
                title="Virtual Consultations"
                subtitle="Manage your telemedicine appointments and video calls."
                showBack={true}
            />

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-[var(--color-border)] mb-8">
                {['all', 'active', 'scheduled', 'completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={cn(
                            "px-4 py-3 font-bold text-sm transition-all relative",
                            filter === tab ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tab !== 'all' && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors",
                                    filter === tab ? "bg-[var(--color-accent)] text-[var(--color-background)]" : "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                                )}>
                                    {consults.filter(c => c.status === tab).length}
                                </span>
                            )}
                        </span>
                        {filter === tab && (
                            <motion.div
                                layoutId="consultFilter"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Consults Grid */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {filteredConsults.length > 0 ? (
                            filteredConsults.map(consult => (
                                <ConsultCard
                                    key={consult.id}
                                    {...consult}
                                    onJoin={() => handleJoinConsult(consult.id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-2">
                                <GlassCard className="p-16 text-center bg-[var(--color-surface-glass)] border-[var(--color-border)]">
                                    <User className="w-16 h-16 text-[var(--color-border)] mx-auto mb-4 opacity-40" />
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 font-['Outfit']">
                                        No {filter} consultations
                                    </h3>
                                    <p className="text-[var(--color-text-muted)] max-w-xs mx-auto">
                                        {filter === 'active'
                                            ? 'No active consultations at the moment'
                                            : filter === 'scheduled'
                                                ? 'No upcoming consultations scheduled'
                                                : 'No completed consultations to show'}
                                    </p>
                                </GlassCard>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-6 border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="font-semibold text-lg mb-4 text-[var(--color-text-primary)]">Quick Actions</h3>
                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        View Schedule
                    </Button>
                    <Button variant="secondary" className="flex-1">
                        <User className="w-4 h-4 mr-2" />
                        Patient List
                    </Button>
                    <Button variant="secondary" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        Consultation Notes
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};

export default ConsultsPage;
