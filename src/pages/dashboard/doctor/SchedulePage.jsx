import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import AnimatedButton from '../../../components/ui/AnimatedButton';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import AddEventForm from './AddEventForm';
import { useToast } from '../../../components/ui/Toast';

const SchedulePage = () => {
    const navigate = useNavigate();
    const [monthIndex, setMonthIndex] = useState(0);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dates = Array.from({ length: 35 }, (_, i) => i + 1 > 31 ? i + 1 - 31 : i + 1); // Mock dates
    const prevMonth = () => setMonthIndex((m) => m - 1);
    const nextMonth = () => setMonthIndex((m) => m + 1);
    const { showToast } = useToast();

    const [events, setEvents] = useState([
        { id: 'e1', title: 'Dr. Johnson - Consult', date: 29, time: '14:30', location: 'Clinic Room 304', notes: '' },
        { id: 'e2', title: 'Surgery - OR 2', date: 15, time: '08:00', location: 'OR 2', notes: '' }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const addEvent = () => setShowAddModal(true);

    const handleCreateEvent = (ev) => {
        setEvents((e) => [{ ...ev, id: 'e' + Date.now() }, ...e]);
        setShowAddModal(false);
        showToast('Event created', { type: 'success' });
    };

    return (
        <div className="h-full flex flex-col">
            <PageHeader
                title="Schedule"
                subtitle={`${new Date().getFullYear()} • ${new Date(new Date().getFullYear(), new Date().getMonth() + monthIndex).toLocaleString(undefined, { month: 'long' })}`}
                action={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white rounded-lg border border-zinc-200 p-1 mr-2">
                            <button aria-label="Previous month" onClick={prevMonth} className="p-1 hover:bg-zinc-100 rounded"><ChevronLeft className="w-5 h-5 text-zinc-500" /></button>
                            <button aria-label="Next month" onClick={nextMonth} className="p-1 hover:bg-zinc-100 rounded"><ChevronRight className="w-5 h-5 text-zinc-500" /></button>
                        </div>
                        <AnimatedButton onClick={addEvent}>
                            <Plus className="w-4 h-4 mr-2" /> Add Event
                        </AnimatedButton>
                    </div>
                }
            />

            <GlassCard className="flex-1 p-6 flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 mb-4">
                    {days.map(d => <div key={d} className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-wide">{d}</div>)}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-4">
                    {dates.slice(0, 31).map((date, i) => ( // simplified
                        <div key={i} className={`p-3 border border-zinc-100 rounded-xl hover:border-zinc-300 transition-colors relative group min-h-[100px] ${date === 29 ? 'bg-zinc-50 ring-1 ring-black/5' : ''}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${date === 29 ? 'text-black' : 'text-zinc-500'}`}>{date}</span>
                                <button aria-label={`Add event on ${date}`} onClick={() => setShowAddModal(true)} className="text-xs text-zinc-400 hover:text-black">+ Add</button>
                            </div>

                            {/* Events for this date */}
                            <div className="mt-2 space-y-1">
                                {events.filter(ev => ev.date === date).map(ev => (
                                    <button key={ev.id} onClick={() => setSelectedEvent(ev)} className="w-full text-left text-xs p-1.5 bg-white border rounded-md shadow-sm truncate hover:bg-zinc-50">
                                        {ev.time} - {ev.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Event Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-[480px] shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Add Event</h3>
                            <AddEventForm onCancel={() => setShowAddModal(false)} onCreate={handleCreateEvent} defaultDate={1} />
                        </div>
                    </div>
                )}

                {/* Event Details Panel */}
                {selectedEvent && (
                    <aside className="fixed right-6 top-24 w-[360px] bg-white rounded-xl p-4 shadow-float z-40">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{selectedEvent.title}</h4>
                            <button onClick={() => setSelectedEvent(null)} className="p-1 rounded hover:bg-zinc-100">Close</button>
                        </div>
                        <p className="text-sm text-zinc-600 mt-3">{selectedEvent.time} • {selectedEvent.location}</p>
                        <p className="text-sm text-zinc-700 mt-3">{selectedEvent.notes}</p>
                    </aside>
                )}
            </GlassCard>
        </div>
    );
};

export default SchedulePage;
