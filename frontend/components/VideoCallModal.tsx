import { useEffect, useRef } from 'react'
import useWebRTC from '../hooks/useWebRTC'
import { io } from 'socket.io-client'

export default function VideoCallModal(
  { roomId, userId, companion, onEnd }:
    { roomId: string, userId: string, companion: any, onEnd: () => void }
) {
  const { localStream, remoteStream, createPeerConnection, closePeerConnection } = useWebRTC()
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    if (!localStream) {
      return
    }

    const socket = io(process.env.NEXT_PUBLIC_SIGNAL_URL || 'http://localhost:8000', { path: '/signal' })
    const pc = createPeerConnection(); // Create the connection once

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('candidate', { roomId, from: userId, candidate: e.candidate });
      }
    };

    socket.on('connect', async () => {
      console.log('connected to signal server');
      socket.emit('join', { roomId, from: userId });

      // This peer is the caller, create the offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId, from: userId, sdp: pc.localDescription });
    });

    socket.on('offer', async (data: any) => {
      console.log('got offer', data);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, from: userId, sdp: pc.localDescription });
      } catch (error) {
        console.error("Failed to handle offer:", error);
      }
    });

    socket.on('answer', async (data: any) => {
      console.log('got answer', data);
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
    });

    socket.on('candidate', async (data: any) => {
      console.log('got candidate', data);
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    return () => {
      socket.disconnect();
      closePeerConnection();
    };
  }, [localStream, roomId, userId, createPeerConnection, closePeerConnection]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div>
          <h3>You</h3>
          <video ref={localVideoRef} autoPlay muted playsInline
            style={{ width: 320, height: 240, backgroundColor: '#333' }} />
        </div>
        <div>
          <h3>{companion.name}</h3>
          <video ref={remoteVideoRef} autoPlay playsInline
            style={{ width: 320, height: 240, backgroundColor: '#333' }} />
        </div>
      </div>
      <button onClick={onEnd} style={{ marginTop: 20 }}>End Call</button>
    </div>
  )
}