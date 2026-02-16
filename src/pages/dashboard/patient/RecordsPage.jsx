import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { FileText, Download, Eye, ShieldCheck } from 'lucide-react';
import AnimatedButton from '../../../components/ui/AnimatedButton';
import { useState } from 'react';
import SearchInput from '../../../components/ui/SearchInput';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';

const RecordItem = ({ title, type, date, doctor, onView, onDownload }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all group">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
            </div>
            <div>
                <h4 className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">{title}</h4>
                <p className="text-xs text-zinc-500">{date} • {doctor}</p>
            </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button aria-label={`View ${title}`} onClick={() => onView?.({ title, type, date, doctor })} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500"><Eye className="w-4 h-4" /></button>
            <button aria-label={`Download ${title}`} onClick={() => onDownload?.({ title, type, date, doctor })} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500"><Download className="w-4 h-4" /></button>
        </div>
    </div>
);

const RecordsPage = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [filter, setFilter] = useState('');

    const items = [
        { title: 'Annual Physical Blood Work', type: 'PDF', date: 'Jan 28, 2026', doctor: 'LabCorp' },
        { title: 'MRI Scans - 3D Render', type: 'ZIP', date: 'Dec 12, 2025', doctor: 'Radiology Dept' },
        { title: 'Vaccination History', type: 'PDF', date: 'Nov 05, 2025', doctor: 'Dr. Smith' },
        { title: 'Cardiology Consultation', type: 'PDF', date: 'Aug 14, 2025', doctor: 'Dr. Johnson' }
    ];

    const filtered = items.filter(i => (`${i.title} ${i.doctor} ${i.type}`).toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <PageHeader
                title="Medical Records"
                subtitle="Access and download your complete medical history."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="col-span-2 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Documents</h3>
                        <div className="relative w-64">
                            <SearchInput placeholder="Filter records..." onChange={(v) => setFilter(v)} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filtered.map((it) => (
                            <RecordItem key={it.title} {...it} onView={(r) => { showToast(`Viewing: ${r.title}`, { type: 'info' }); navigate('/dashboard/patient/records/view'); }} onDownload={(r) => { const blob = new Blob(['Sample content for ' + r.title], { type: r.type === 'ZIP' ? 'application/zip' : 'application/pdf' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${r.title}.${r.type.toLowerCase()}`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); showToast(`Download started: ${r.title}`, { type: 'success' }); }} />
                        ))}
                    </div>
                </GlassCard>

                <div className="space-y-6">
                    <GlassCard className="p-6 bg-blue-50/50 border-blue-100">
                        <div className="mb-4 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-blue-900 mb-2">HIPAA Secure</h3>
                        <p className="text-sm text-blue-700/80 mb-4">Your records are encrypted with AES-256 bit security and are only accessible by you and your authorized care team.</p>
                        <AnimatedButton className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0" aria-label="Manage Access" onClick={() => { showToast('Opening Manage Access', { type: 'info' }); navigate('/dashboard/patient/manage-access'); }}>Manage Access</AnimatedButton>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default RecordsPage;
