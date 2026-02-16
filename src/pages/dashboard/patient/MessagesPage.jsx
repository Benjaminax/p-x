import PageHeader from '../../../components/ui/PageHeader';
import GlassCard from '../../../components/ui/GlassCard';
import { Search, Send } from 'lucide-react';
import { useState } from 'react';
import SearchInput from '../../../components/ui/SearchInput';

const MessagesPage = () => {
    const [active, setActive] = useState(0);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { from: 'them', text: 'Hi Jane, your lab results look standard for the most part. I\'d like to discuss the Vitamin D levels next week.' },
        { from: 'me', text: "That sounds good, Dr. Sarah. Should I continue with the current supplements?" }
    ]);

    const [contactFilter, setContactFilter] = useState('');
    const contacts = ['Dr. Sarah Johnson', 'Dr. Emily Chen', 'Front Desk', 'Billing Dept'];
    const filteredContacts = contacts.filter(c => c.toLowerCase().includes(contactFilter.toLowerCase()));

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((m) => [...m, { from: 'me', text: input.trim() }]);
        setInput('');
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <PageHeader title="Messages" subtitle="Secure communication with your care team." />

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Contact List */}
                <GlassCard className="w-80 flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-zinc-100">
                        <div className="relative">
                            <SearchInput placeholder="Search..." onChange={(v) => setActive(0)} />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredContacts.map((name, i) => (
                            <div key={i} onClick={() => setActive(i)} className={`p-4 border-b border-zinc-50 cursor-pointer hover:bg-zinc-50 transition-colors ${i === active ? 'bg-zinc-50 border-l-4 border-l-black' : ''}`}>
                                <h4 className="font-medium text-sm">{name}</h4>
                                <p className="text-xs text-zinc-500 mt-1 truncate">You: Thanks, see you then.</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Chat Area */}
                <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">S</div>
                            <div>
                                <h3 className="font-medium">Dr. Sarah Johnson</h3>
                                <p className="text-xs text-green-600 flex items-center gap-1">● Online</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-50/30">
                        {messages.map((m, i) => (
                            <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex justify-start'}>
                                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm ${m.from === 'me' ? 'bg-black text-white rounded-tr-none' : 'bg-white rounded-tl-none border border-zinc-100'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-zinc-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                                placeholder="Type a secure message..."
                                className="flex-1 px-4 py-3 bg-zinc-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                            <button aria-label="Send message" onClick={sendMessage} className="p-3 bg-black text-white rounded-xl hover:scale-105 transition-transform">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default MessagesPage;
