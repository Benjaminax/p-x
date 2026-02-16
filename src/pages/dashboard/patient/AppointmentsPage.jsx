import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Calendar, MapPin, Clock, Plus, Video, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';

const AppointmentItem = ({ doctor, specialty, date, time, type, status }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Status badges
    const isCompleted = status === 'completed';
    const isUpcoming = status === 'upcoming';
    const isVirtual = type === 'Virtual';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-border-hover)] hover:shadow-md transition-all bg-[var(--color-surface)] mb-4 group relative overflow-hidden">
            {isUpcoming && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)]"></div>}

            <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-[var(--color-surface-hover)] flex items-center justify-center font-bold text-xl text-[var(--color-text-muted)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-background)] transition-colors shadow-sm">
                    {doctor.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-[var(--color-text-primary)] text-lg">{doctor}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">{specialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1.5 transition-colors group-hover:text-[var(--color-text-secondary)]"><Calendar className="w-3.5 h-3.5" /> {date}</span>
                        <span className="flex items-center gap-1.5 transition-colors group-hover:text-[var(--color-text-secondary)]"><Clock className="w-3.5 h-3.5" /> {time}</span>
                        <span className="flex items-center gap-1.5 transition-colors group-hover:text-[var(--color-text-secondary)]"><MapPin className="w-3.5 h-3.5" /> {type}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-3">
                {isUpcoming && (
                    <>
                        <Button size="sm" variant="outline" onClick={() => { showToast('Opening reschedule flow', { type: 'info' }); }}>Reschedule</Button>
                        {isVirtual && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-500/20" onClick={() => navigate('/meeting')}>
                                <Video className="w-3.5 h-3.5 mr-2" /> Join Call
                            </Button>
                        )}
                    </>
                )}
                {isCompleted && (
                    <span className="px-3 py-1 bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] rounded-full text-xs font-medium flex items-center gap-1 border border-[var(--color-border)]">
                        <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                )}
            </div>
        </div>
    );
};

const AppointmentsPage = () => {
    const navigate = useNavigate();

    // Get appointments from localStorage
    const upcomingAppointments = JSON.parse(localStorage.getItem('upcomingAppointments') || '[]');
    const pastAppointments = JSON.parse(localStorage.getItem('pastAppointments') || '[]');

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <PageHeader
                title="Appointments"
                subtitle="Manage your visits and consultations."
                action={
                    <Button onClick={() => navigate('/dashboard/patient/appointments/new')} className="bg-[var(--color-accent)] text-[var(--color-background)] hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" /> New Appointment
                    </Button>
                }
            />

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-bold mb-4 ml-1 flex items-center gap-2 text-[var(--color-text-primary)]">
                        Upcoming <span className="text-xs bg-[var(--color-accent)] text-[var(--color-background)] px-2 py-0.5 rounded-full font-normal">{upcomingAppointments.length}</span>
                    </h3>

                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((apt, idx) => (
                            <AppointmentItem
                                key={idx}
                                doctor={apt.doctor}
                                specialty={apt.specialty}
                                date={apt.date}
                                time={apt.time}
                                type={apt.type}
                                status="upcoming"
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)] overflow-hidden">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4 transition-transform hover:scale-110">
                                <Calendar className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">No Upcoming Appointments</h3>
                            <p className="text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto">Your schedule is clear. Book an appointment when you need care.</p>
                            <Button onClick={() => navigate('/dashboard/patient/appointments/new')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Book Appointment
                            </Button>
                        </div>
                    )}
                </div>

                {pastAppointments.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold mb-4 ml-1 text-[var(--color-text-muted)]">Past Visits</h3>
                        <div className="opacity-80 hover:opacity-100 transition-opacity">
                            {pastAppointments.map((apt, idx) => (
                                <AppointmentItem
                                    key={idx}
                                    doctor={apt.doctor}
                                    specialty={apt.specialty}
                                    date={apt.date}
                                    time={apt.time}
                                    type={apt.type}
                                    status="completed"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;
