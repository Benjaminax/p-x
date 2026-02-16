import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export default function ScheduleAddPage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    showToast('Event added to schedule', { type: 'success' });
    navigate('/dashboard/doctor/schedule');
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Add Event" subtitle="Add a calendar event to the schedule." />
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div>
          <label className="block text-sm">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div className="flex justify-end">
          <Button className="bg-black text-white" onClick={submit}>Add Event</Button>
        </div>
      </form>
    </div>
  )
}
