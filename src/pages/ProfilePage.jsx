import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import { useState } from 'react';
import { useToast } from '../components/ui/Toast';

export default function ProfilePage(){
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const { showToast } = useToast();

  const save = () => {
    // Persist to storage for now
    localStorage.setItem('profile', JSON.stringify({ name, email, phone }));
    showToast('Profile saved', { type: 'success' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="My Profile" subtitle="Manage your personal information" />
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <div className="text-xs text-zinc-600 mb-1">Full name</div>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </label>
          <label>
            <div className="text-xs text-zinc-600 mb-1">Email</div>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </label>
          <label className="md:col-span-2">
            <div className="text-xs text-zinc-600 mb-1">Phone</div>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={save} className="px-4 py-2 rounded bg-black text-white">Save</button>
        </div>
      </GlassCard>
    </div>
  );
}
