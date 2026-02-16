import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { useLocation } from 'react-router-dom';

export default function RecordViewPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const title = params.get('title') || 'Record Document';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title={`Viewing: ${title}`} subtitle="Document Viewer" />

      <GlassCard className="p-6">
        <div className="flex flex-col gap-4">
          <div className="h-96 bg-zinc-100 rounded-md flex items-center justify-center">PDF / Document viewer placeholder</div>
          <p className="text-sm text-zinc-500">Use server-hosted PDFs or a viewer like PDF.js in production to render documents securely.</p>
        </div>
      </GlassCard>
    </div>
  );
}
