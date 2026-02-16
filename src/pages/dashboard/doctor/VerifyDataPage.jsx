import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';

export default function VerifyDataPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const verify = () => {
    showToast('Data verified', { type: 'success' });
    navigate('/dashboard/doctor');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title={`Verify Data: ${id}`} subtitle="Confirm or correct the incoming data." showBack={true} />
      <GlassCard className="p-6">
        <div className="mb-4">Sensor readout and EHR record snapshot placeholder.</div>
        <div className="flex gap-3 justify-end">
          <Button className="bg-white" onClick={() => { showToast('Marked as needs correction', { type: 'info' }); }}>Request Correction</Button>
          <Button className="bg-green-600 text-white" onClick={verify}>Verify</Button>
        </div>
      </GlassCard>
    </div>
  );
}
