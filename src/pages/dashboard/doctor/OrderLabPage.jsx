import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';

export default function OrderLabPage() {
  const [test, setTest] = useState('CBC');
  const { showToast } = useToast();

  const submit = () => {
    showToast('Lab order placed', { type: 'success' });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Order Lab" subtitle="Place an order for lab work." showBack={true} />
      <GlassCard className="p-6">
        <div>
          <label className="block text-sm">Test</label>
          <select value={test} onChange={(e) => setTest(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
            <option>CBC</option>
            <option>Metabolic Panel</option>
            <option>Lipid Panel</option>
          </select>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={submit} className="bg-black text-white">Place Order</Button>
        </div>
      </GlassCard>
    </div>
  )
}
