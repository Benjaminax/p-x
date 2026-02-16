import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';

export default function WriteNotePage() {
  const [text, setText] = useState('');
  const { showToast } = useToast();

  const save = () => {
    showToast('Note saved', { type: 'success' });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Write Note" subtitle="Add a clinical note to the patient's record." showBack={true} />
      <GlassCard className="p-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full rounded-md border p-3" />
        <div className="flex justify-end mt-4">
          <Button onClick={save} className="bg-black text-white">Save Note</Button>
        </div>
      </GlassCard>
    </div>
  )
}
