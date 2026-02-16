import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import { useState } from 'react';
import { useToast } from '../components/ui/Toast';

export default function SettingsPage(){
  const [notifications, setNotifications] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { showToast } = useToast();

  const save = () => {
    localStorage.setItem('settings', JSON.stringify({ notifications, reducedMotion }));
    showToast('Settings saved', { type: 'success' });
  }; 

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Settings" subtitle="Application & account preferences" />
      <GlassCard className="p-6">
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Notifications</span>
            <input type="checkbox" checked={notifications} onChange={(e)=>setNotifications(e.target.checked)} />
          </label>

          <label className="flex items-center justify-between">
            <span>Reduced motion</span>
            <input type="checkbox" checked={reducedMotion} onChange={(e)=>setReducedMotion(e.target.checked)} />
          </label>



          <div className="flex justify-end">
            <button onClick={save} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save Settings</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
