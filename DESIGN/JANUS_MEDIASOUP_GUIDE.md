# Janus / mediasoup Integration Guide (Scaffold)

This document explains next steps to replace the manual WebRTC demo with a production-ready Janus or mediasoup integration.

## Overview
- Janus and mediasoup are media servers that handle advanced scenarios: SFU/MCU topologies, recording, MCU mixing, server-side processing, and relaying via TURN.
- The current client uses a manual SDP exchange scaffold for quick testing. Production should use a signaling server and STUN/TURN infra.

## High-Level Tasks
1. Choose an SFU: Janus (C, fully-featured plugins) or mediasoup (node-based, flexible). Both are valid. Choose based on team expertise.
2. Deploy STUN/TURN servers (coturn recommended) and configure with secure credentials.
3. Implement a backend signaling channel:
   - WebSockets for low-latency messages (room join, publish, subscribe, candidate exchange)
   - Exchange JSON messages referencing Janus/mediasoup sessions/transport ids
4. Client changes:
   - Replace manual SDP copy/paste with a signaling flow
   - Use mediasoup-client or janus.js to create transports and handle produces/consumes
   - Implement lobby/room controls, mute/unmute, camera selection, bandwidth settings
5. Security & compliance:
   - Use HTTPS/WSS (TLS) for signaling
   - Apply authentication / token-based room access
   - Ensure HIPAA-compliant logging & storage policies for recordings

## Implementation Notes (mediasoup)
- Server: mediasoup + socket.io. Create Router/Worker on start, then create transports per client.
- Client: mediasoup-client -> create Device(), load RTP capabilities, create send/recv transports, produce audio/video tracks, and consume other producers.

## Implementation Notes (Janus)
- Server: janus-gateway. Use VideoRoom plugin for multi-party.
- Client: use janus.js; handle handlePlugin and plugin-specific messages.

## Testing & Debugging
- Start with two local browser tabs and a STUN-only flow for basic connectivity.
- Add TURN once NAT issues are observed.
- Use network/RTC stats and chrome://webrtc-internals for tracing.

## Next steps I can implement for you
- Scaffold a Socket.IO signaling server + sample mediasoup server in the repo (Dockerfile included).
- Replace manual SDP page with a Janus/mediasoup client flow.
- Add TURN/coturn Docker compose for local testing.

If you want, I can scaffold mediasoup + a simple signaling server next (option: Janus instead). Tell me which SFU you prefer: "mediasoup" or "janus".