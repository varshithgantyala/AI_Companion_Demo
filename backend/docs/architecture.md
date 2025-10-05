# Architecture (Signaling & Media Flow)

1. Frontend requests create room -> POST /api/video/rooms
2. Both peers connect to Socket.IO /signal endpoint and `join` the roomId
3. Peer A creates RTCPeerConnection, gathers ICE, sends `offer` via socket
4. Peer B receives `offer`, sets remote desc, creates `answer`, sends `answer`
5. Both peers exchange `candidate` events via signaling
6. Media flows P2P via STUN/TURN (TURN used if NAT traversal fails)
