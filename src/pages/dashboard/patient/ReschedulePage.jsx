import { useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';

export default function ReschedulePage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const submit = (e) => {
    e.preventDefault();
    showToast('Reschedule request sent', { type: 'success' });
    navigate('/dashboard/patient/appointments');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Reschedule Appointment" subtitle="Select a new date and time." showBack={true} />

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div className="flex justify-end">
          <Button onClick={submit} aria-label="Reschedule" className="bg-black text-white">Send Reschedule</Button>
        </div>
      </form>
    </div>
  );
}
