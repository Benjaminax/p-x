import { useLocation } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';

export default function SearchResultsPage(){
  const { search } = useLocation();
  const q = new URLSearchParams(search).get('q') || '';

  // Minimal mock results for UI demonstration
  const results = [
    { id: 1, type: 'Doctor', title: 'Dr. Sarah Johnson - Cardiologist', meta: 'Cardiology • Project X Hospital' },
    { id: 2, type: 'Record', title: 'MRI Scans - 3D Render', meta: 'Radiology' },
    { id: 3, type: 'Appointment', title: 'Dr. Emily Chen - Feb 2, 10:00', meta: 'Virtual' }
  ].filter(r => r.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title={`Search: ${q}`} subtitle="Search results across doctors, records, and appointments" />

      <div className="grid gap-4">
        {results.length === 0 && (
          <GlassCard className="p-6 text-zinc-600">No results found.</GlassCard>
        )}

        {results.map(r => (
          <GlassCard key={r.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-500">{r.type}</div>
              <div className="font-semibold">{r.title}</div>
              <div className="text-xs text-zinc-500 mt-1">{r.meta}</div>
            </div>
            <div>
              <button className="px-3 py-1 rounded bg-black text-white">Open</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
