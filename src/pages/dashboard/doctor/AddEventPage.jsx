import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import AddEventForm from './AddEventForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';

export default function AddEventPage(){
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreate = (ev) => {
    // In a real app this would persist to backend; here we show toast and navigate
    showToast('Event created (not persisted in demo)', { type: 'success' });
    navigate('/dashboard/doctor/schedule');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Add Event" subtitle="Create a new calendar event" />
      <GlassCard className="p-6">
        <AddEventForm onCancel={() => navigate('/dashboard/doctor/schedule')} onCreate={handleCreate} />
      </GlassCard>
    </div>
  );
}
