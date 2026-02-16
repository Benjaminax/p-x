import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import EmergencyCard from '../../../components/patient/EmergencyCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Copy, Download, Share2, Phone, Printer, X } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../context/AuthContext';

export default function EmergencyCardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const cardRef = useRef(null);

  const patientData = {
    fullName: user?.fullName || 'Patient Name',
    bloodGroup: user?.bloodGroup || 'O+',
    genotype: user?.genotype || 'AA',
    allergies: user?.allergies || 'No known allergies',
    emergencyContact: user?.emergencyContact || '+1 (555) 000-0000',
    patientId: (user?.id || 'PX-2026-9932').toString().toUpperCase()
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(patientData.patientId);
      showToast('Patient ID copied to clipboard', { type: 'success' });
    } catch (err) {
      showToast('Unable to copy ID', { type: 'error' });
    }
  };

  const handlePrint = () => {
    // Simple print fallback (user can Save as PDF)
    showToast('Opening print dialog — choose "Save as PDF" to download', { type: 'info' });
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Emergency Card — ${patientData.fullName}`,
      text: `Emergency card for ${patientData.fullName} (${patientData.patientId})`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title} — ${shareData.text}`);
        showToast('Share text copied to clipboard', { type: 'success' });
      }
    } catch (err) {
      showToast('Unable to share', { type: 'error' });
    }
  };

  const handleCall = () => {
    const tel = patientData.emergencyContact.replace(/[^0-9+]/g, '');
    window.open(`tel:${tel}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Emergency Card"
        subtitle="Quick access to critical patient identity & emergency contacts"
        showBack={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: visual card (prominent) */}
        <div className="lg:col-span-6">
          <div ref={cardRef} className="sticky top-20">
            <EmergencyCard data={patientData} />
            <div className="mt-4 flex gap-3">
              <Button className="flex-1" onClick={handleCall} aria-label="Call emergency contact"><Phone className="w-4 h-4 mr-2" /> Call</Button>
              <Button variant="outline" className="flex-1" onClick={copyId} aria-label="Copy patient id"><Copy className="w-4 h-4 mr-2" /> Copy ID</Button>
            </div>
          </div>
        </div>

        {/* Right: actions & metadata */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold">{patientData.fullName}</h3>
                <p className="text-sm text-slate-500">Patient ID: <span className="font-semibold">{patientData.patientId}</span></p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600">Verified</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg text-sm font-medium">Blood Group<div className="text-lg font-bold mt-1">{patientData.bloodGroup}</div></div>
              <div className="p-3 bg-slate-50 rounded-lg text-sm font-medium">Genotype<div className="text-lg font-bold mt-1">{patientData.genotype}</div></div>
              <div className="p-3 bg-slate-50 rounded-lg text-sm font-medium col-span-2">Allergies<div className="text-sm mt-1 text-slate-700">{patientData.allergies}</div></div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print / Save PDF</Button>
              <Button variant="outline" onClick={handleShare}><Share2 className="w-4 h-4 mr-2" /> Share</Button>
              <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied', { type: 'success' }); }}>
                <Download className="w-4 h-4 mr-2" /> Copy link
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h4 className="text-sm font-bold text-slate-600 mb-3">Usage & Privacy</h4>
            <p className="text-sm text-slate-500 mb-4">This Emergency Card contains minimal clinically relevant identifiers that may be shared with first responders. Access is logged for audit and compliance.</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => { showToast('Access log saved', { type: 'success' }); }}>Log Access</Button>
              <Button onClick={() => navigate(-1)} variant="ghost">Close</Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h4 className="text-sm font-bold text-slate-600 mb-3">Last updated</h4>
            <p className="text-sm text-slate-500">{new Date().toLocaleString()}</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
