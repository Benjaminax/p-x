import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { useParams, useNavigate } from 'react-router-dom';
import AnimatedButton from '../../../components/ui/AnimatedButton';
import { useToast } from '../../../components/ui/Toast';
import ThreeDViewer from '../../../components/viewers/ThreeDViewer';
import LottieAnimation from '../../../components/ui/LottieAnimation';

export default function ScanReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const accept = () => {
    showToast('Scan accepted', { type: 'success' });
    navigate('/dashboard/doctor');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title={`Scan Review: ${id}`} subtitle="Review the imaging and add notes." />
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <ThreeDViewer />
            <p className="text-xs text-zinc-500 mt-2">Interactive 3D viewer. Use mouse to rotate and zoom. This is a lightweight viewer scaffold — integrate glTF models or DICOM renderer for production.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-md bg-white shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Findings</h4>
                <p className="text-sm text-zinc-600 mt-2">Region highlighted shows an anomalous density. Confidence: <strong>94%</strong>.</p>
              </div>
              <div>
                <LottieAnimation url="https://assets8.lottiefiles.com/packages/lf20_x62chJ.json" style={{ width: 80, height: 80 }} />
              </div>
            </div>

            <div className="p-3 rounded-md bg-white shadow-sm flex-1">
              <h4 className="font-semibold">Notes</h4>
              <textarea className="w-full mt-2 p-2 border rounded h-32" placeholder="Add clinical notes or observations..." />
            </div>

            <div className="flex gap-3 justify-end">
              <AnimatedButton onClick={accept} className="bg-green-600 text-white">Accept</AnimatedButton>
              <AnimatedButton onClick={() => { showToast('Scan flagged for further review', { type: 'info' }); navigate('/dashboard/doctor'); }} className="bg-amber-500">Flag</AnimatedButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
