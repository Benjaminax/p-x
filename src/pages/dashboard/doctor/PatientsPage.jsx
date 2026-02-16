import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import AnimatedButton from '../../../components/ui/AnimatedButton';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import SearchInput from '../../../components/ui/SearchInput';

const PatientsPage = () => {
    const [filter, setFilter] = useState('');
    const patients = [
        { name: "Alice Freeman", id: "PX-8291", age: "34F", condition: "Migraine (Chronic)", status: "Stable" },
        { name: "Robert Chen", id: "PX-9921", age: "58M", condition: "Hypertension", status: "Critical" },
        { name: "Sarah Jones", id: "PX-1120", age: "29F", condition: "Post-op Recovery", status: "Improving" },
        { name: "David Miller", id: "PX-3394", age: "45M", condition: "Neuropathy", status: "Stable" }
    ];

    const filtered = patients.filter(p => (`${p.name} ${p.id} ${p.condition}`).toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="space-y-8">
            <PageHeader
                title="Patient Management"
                subtitle="View and manage your patient roster."
                action={
                    <div className="flex gap-2">
                        <AnimatedButton variant="secondary"><Filter className="w-4 h-4 mr-2" /> Filter</AnimatedButton>
                        <AnimatedButton>Add Patient</AnimatedButton>
                    </div>
                }
            />

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                        <SearchInput placeholder="Search patients by name, ID, or condition..." onChange={(v) => setFilter(v)} />
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="text-zinc-500 font-medium bg-zinc-50 border-b border-zinc-100">
                        <tr>
                            <th className="px-6 py-4">Patient Name</th>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Age/Sex</th>
                            <th className="px-6 py-4">Condition</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filtered.map((p) => (
                            <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-zinc-900">{p.name}</td>
                                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{p.id}</td>
                                <td className="px-6 py-4 text-zinc-600">{p.age}</td>
                                <td className="px-6 py-4 text-zinc-600">{p.condition}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                            p.status === 'Stable' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 group-hover:text-black transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
};

export default PatientsPage;
