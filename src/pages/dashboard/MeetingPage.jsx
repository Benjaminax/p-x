import PageHeader from '../../components/ui/PageHeader';
import { useLocation } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import { useRef, useState } from 'react';
import { useToast } from '../../components/ui/Toast';

export default function MeetingPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id') || 'meeting-1';

  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const [localSDP, setLocalSDP] = useState('');
  const [remoteSDP, setRemoteSDP] = useState('');
  const { showToast } = useToast();

  const startLocal = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280 }, audio: true });
      if (localRef.current) localRef.current.srcObject = stream;
    } catch (err) {
      showToast('Unable to access camera: ' + err.message, { type: 'error' });
    }
  };

  const call = async () => {
    if (pcRef.current) { showToast('Call already in progress', { type: 'info' }); return; }
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pcRef.current = pc;

    const stream = localRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(t => pc.addTrack(t, stream));

    pc.ontrack = (e) => { if (remoteRef.current) remoteRef.current.srcObject = e.streams[0]; };
    pc.onicecandidate = (e) => { if (e.candidate) setLocalSDP((s) => s); }; // we set final SDP below

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // wait for ICE to gather
    setTimeout(async () => {
      const desc = pc.localDescription;
      setLocalSDP(JSON.stringify(desc));
      showToast('Offer created; copy local SDP and share with remote', { type: 'info' });
    }, 1000);
  };

  const answer = async () => {
    if (!remoteSDP) { showToast('Paste remote SDP to answer', { type: 'error' }); return; }
    const obj = JSON.parse(remoteSDP);
    if (!pcRef.current) {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      pcRef.current = pc;
      const stream = localRef.current?.srcObject;
      if (stream) stream.getTracks().forEach(t => pc.addTrack(t, stream));
      pc.ontrack = (e) => { if (remoteRef.current) remoteRef.current.srcObject = e.streams[0]; };
    }
    await pcRef.current.setRemoteDescription(obj);
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    setTimeout(() => setLocalSDP(JSON.stringify(pcRef.current.localDescription)), 800);
    showToast('Answer created. Copy local SDP and send back to caller', { type: 'success' });
  };

  const hangup = () => {
    if (pcRef.current) {
      pcRef.current.getSenders().forEach(s => s.track?.stop());
      pcRef.current.close();
      pcRef.current = null;
      setLocalSDP('');
      setRemoteSDP('');
      if (localRef.current) localRef.current.srcObject = null;
      if (remoteRef.current) remoteRef.current.srcObject = null;
      showToast('Call ended', { type: 'info' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="Virtual Meeting" subtitle="Join the secure consultation" />

      <GlassCard className="p-6">
        <p className="mb-4">Meeting ID: <strong>{id}</strong></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="bg-black rounded-md overflow-hidden">
              <video ref={localRef} playsInline autoPlay muted className="w-full h-56 object-cover bg-black" />
            </div>
            <div className="mt-2 bg-white rounded p-3">
              <button onClick={startLocal} className="px-3 py-2 rounded bg-black text-white mr-2">Start Camera</button>
              <button onClick={call} className="px-3 py-2 rounded bg-blue-600 text-white mr-2">Call (Create Offer)</button>
              <button onClick={answer} className="px-3 py-2 rounded bg-green-600 text-white mr-2">Answer</button>
              <button onClick={hangup} className="px-3 py-2 rounded bg-red-600 text-white">Hang Up</button>
            </div>
          </div>

          <div>
            <div className="bg-black rounded-md overflow-hidden">
              <video ref={remoteRef} playsInline autoPlay className="w-full h-56 object-cover bg-black" />
            </div>

            <div className="mt-2 space-y-2">
              <label className="block text-xs text-zinc-600">Local SDP (copy to remote)</label>
              <textarea value={localSDP} readOnly className="w-full h-28 p-2 border rounded text-xs" />

              <label className="block text-xs text-zinc-600">Remote SDP (paste here to answer)</label>
              <textarea value={remoteSDP} onChange={(e) => setRemoteSDP(e.target.value)} className="w-full h-28 p-2 border rounded text-xs" />
              <div className="flex gap-2 mt-2">
                <button onClick={() => { navigator.clipboard?.writeText(localSDP); showToast('Local SDP copied to clipboard', { type: 'success' }); }} className="px-3 py-2 rounded bg-zinc-100">Copy Local SDP</button>
                <button onClick={() => { setRemoteSDP(''); showToast('Cleared', { type: 'info' }); }} className="px-3 py-2 rounded bg-zinc-100">Clear</button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-zinc-500 mt-3">This is a lightweight WebRTC demo using manual SDP exchange (good for testing or integrating with Janus/mediasoup). For production, integrate a signaling server and a media gateway (Janus/mediasoup) and secure STUN/TURN infrastructure.</p>
      </GlassCard>
    </div>
  );
}
