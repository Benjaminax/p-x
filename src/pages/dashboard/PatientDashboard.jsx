import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Activity, Calendar, Heart, Thermometer, Droplet, Clock, Plus } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const VitalsCard = ({ icon: Icon, title, value, unit, status, color }) => (
    <Card>
        <CardContent className="p-6 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
                <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{value}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{unit}</span>
                </div>
                <p className={`text-xs mt-1 font-medium ${status === 'Normal' ? 'text-green-600' : 'text-amber-600'
                    }`}>
                    {status}
                </p>
            </div>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </CardContent>
    </Card>
);

const AppointmentCard = ({ doctor, specialty, time, date, type }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
            {doctor.charAt(0)}
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-sm">{doctor}</h4>
            <p className="text-xs text-[var(--color-text-muted)]">{specialty} • {type}</p>
        </div>
        <div className="text-right">
            <p className="font-medium text-sm">{time}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{date}</p>
        </div>
    </div>
);

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Health Overview</h1>
                    <p className="text-[var(--color-text-muted)]">Here's your daily health summary and upcoming schedule.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate('/dashboard/patient/appointments')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                    </Button>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <VitalsCard
                    icon={Heart}
                    title="Heart Rate"
                    value="72"
                    unit="bpm"
                    status="Normal"
                    color="bg-rose-500"
                />
                <VitalsCard
                    icon={Thermometer}
                    title="Temperature"
                    value="98.6"
                    unit="°F"
                    status="Normal"
                    color="bg-orange-500"
                />
                <VitalsCard
                    icon={Droplet}
                    title="Blood Pressure"
                    value="120/80"
                    unit="mmHg"
                    status="Normal"
                    color="bg-blue-500"
                />
                <VitalsCard
                    icon={Activity}
                    title="Oxygen Level"
                    value="98"
                    unit="%"
                    status="Normal"
                    color="bg-emerald-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Appointments & Medications) */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Upcoming Appointments</CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/dashboard/patient/appointments')}>View All</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AppointmentCard
                                doctor="Dr. Sarah Johnson"
                                specialty="Cardiologist"
                                date="Today"
                                time="14:30"
                                type="Consultation"
                            />
                            <AppointmentCard
                                doctor="Dr. Michael Chen"
                                specialty="Neurologist"
                                date="Tomorrow"
                                time="09:00"
                                type="Follow-up"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Treatment Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300 text-gray-400">
                                Treatment Chart Visualization Area
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Notifications & Quick Actions) */}
                <div className="space-y-8">
                    <Card className="bg-black text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-white">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="secondary" className="w-full justify-start bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700" onClick={() => { showToast('Prescription request submitted', { type: 'success' }); navigate('/dashboard/patient/prescriptions'); }}>
                                <Plus className="w-4 h-4 mr-2" /> Request Prescription
                            </Button>
                            <Button variant="secondary" className="w-full justify-start bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700" onClick={() => navigate('/dashboard/patient/health')}>
                                <Activity className="w-4 h-4 mr-2" /> Log Vitals
                            </Button>
                            <Button variant="secondary" className="w-full justify-start bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700" onClick={() => navigate('/dashboard/patient/records')}>
                                <Clock className="w-4 h-4 mr-2" /> View History
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "Lab Results Ready", time: "2 hours ago", type: "result" },
                                { title: "Appointment Confirmed", time: "5 hours ago", type: "appt" },
                                { title: "Prescription Renewed", time: "Yesterday", type: "rx" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium">{item.title}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
