import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';

export default function RosterPage(){
  const doctors = [
    { name: 'Dr. Sarah Johnson', role: 'Cardiologist' },
    { name: 'Dr. Emily Chen', role: 'GP' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="Roster" subtitle="Hospital staff and on-call schedule." />
      <GlassCard className="p-6">
        <ul className="space-y-3">
          {doctors.map((d,i) => (
            <li key={i} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-zinc-500">{d.role}</p>
              </div>
              <div className="text-xs text-zinc-400">On Call</div>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}
