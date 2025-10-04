import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import io  from 'socket.io-client'
import { useWebRTC } from '../hooks/useWebRTC'

export default function VideoCallModal({ roomId, userId, companion, onEnd }: any) {
  const { startLocalMedia, localStream, remoteStream, toggleCamera, toggleMic, createPeerConnection } = useWebRTC()
  const socketRef = useRef<any>(null)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SIGNAL_URL || 'http://localhost:8000')
    const socket = socketRef.current
    socket.on('connect', () => console.log('socket connected'))
    socket.on('offer', async (data: any) => {
      console.log('got offer', data)
      const pc = await createPeerConnection()
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socket.emit('answer', { roomId, from: userId, sdp: pc.localDescription })
    })
    socket.on('answer', async (data: any) => {
      console.log('got answer', data)
      const pc = await createPeerConnection()
      if (data.sdp) await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
    })
    socket.on('candidate', async (data: any) => {
      const pc = await createPeerConnection()
      if (data.candidate) {
        try { await pc.addIceCandidate(data.candidate) } catch (e) { console.warn(e) }
      }
    })
    socket.emit('join', { roomId, userId, role: 'user' })
    setJoined(true)
    return () => {
      socket.disconnect()
    }
  }, [roomId])

  useEffect(() => {
    (async () => {
      await startLocalMedia()
    })()
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 20, background: '#fff', padding: 12, borderRadius: 8 }}>
      <h2>Call with {companion.name}</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <video autoPlay playsInline ref={(el) => { if (el && localStream) el.srcObject = localStream }} style={{ width: 300, height: 225, background: '#000' }} />
        <video autoPlay playsInline ref={(el) => { if (el && remoteStream) el.srcObject = remoteStream }} style={{ width: 300, height: 225, background: '#000' }} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => toggleMic(false)}>Mute</button>
        <button onClick={() => toggleMic(true)}>Unmute</button>
        <button onClick={() => toggleCamera(false)}>Camera Off</button>
        <button onClick={() => toggleCamera(true)}>Camera On</button>
        <button onClick={() => { socketRef.current && socketRef.current.emit('leave', { roomId, userId }); onEnd && onEnd(); }}>End Call</button>
      </div>
    </div>
  )
}
