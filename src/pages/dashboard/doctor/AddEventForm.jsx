import { useState } from 'react';

export default function AddEventForm({ onCancel, onCreate, defaultDate = 1 }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('Clinic Room 101');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, date: Number(date), time, location, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <div className="text-xs text-zinc-600 mb-1">Title</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded" />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label>
          <div className="text-xs text-zinc-600 mb-1">Date (day)</div>
          <input type="number" min={1} max={31} value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </label>
        <label>
          <div className="text-xs text-zinc-600 mb-1">Time</div>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </label>
      </div>

      <label>
        <div className="text-xs text-zinc-600 mb-1">Location</div>
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </label>

      <label>
        <div className="text-xs text-zinc-600 mb-1">Notes</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
      </label>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded bg-zinc-100">Cancel</button>
        <button type="submit" className="px-3 py-2 rounded bg-black text-white">Create</button>
      </div>
    </form>
  );
}
