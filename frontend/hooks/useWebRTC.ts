import { useRef, useState } from 'react'
import io from 'socket.io-client'
const socket = io(process.env.NEXT_PUBLIC_SIGNAL_URL || 'http://localhost:8000')

export function useWebRTC() {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  async function startLocalMedia() {
    const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    setLocalStream(s)
    return s
  }

  async function createPeerConnection() {
    if (pcRef.current) return pcRef.current
    const cfg = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/video/webrtc/config').then(r => r.json())
    const pc = new RTCPeerConnection(cfg)
    pc.onicecandidate = (ev) => {
      if (ev.candidate) socket.emit('candidate', { roomId: (window as any).__ROOM_ID, from: 'user', candidate: ev.candidate })
    }
    pc.ontrack = (ev) => {
      setRemoteStream(ev.streams[0])
    }
    if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream))
    pcRef.current = pc
    return pc
  }

  function toggleMic(enabled: boolean) {
    localStream?.getAudioTracks().forEach(t => t.enabled = enabled)
  }

  function toggleCamera(enabled: boolean) {
    localStream?.getVideoTracks().forEach(t => t.enabled = enabled)
  }

  return { startLocalMedia, createPeerConnection, toggleMic, toggleCamera, localStream, remoteStream }
}
