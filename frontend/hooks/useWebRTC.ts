import { useState, useEffect, useRef, useCallback } from 'react'

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
}

export default function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    async function getMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setLocalStream(stream)
    }
    getMedia()
  }, [])

  const createPeerConnection = useCallback(() => {
    if (!peerConnectionRef.current) {
      const pc = new RTCPeerConnection(ICE_SERVERS)

      pc.onicecandidate = (ev) => {
        // This will be handled in the component
      }

      pc.ontrack = (ev) => {
        // FIX: Use a new MediaStream object to ensure React state updates correctly
        const stream = new MediaStream();
        stream.addTrack(ev.track);
        setRemoteStream(stream);
      }
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream)
        })
      }

      peerConnectionRef.current = pc
    }
    return peerConnectionRef.current
  }, [localStream])

  const closePeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
  }

  return { localStream, remoteStream, createPeerConnection, closePeerConnection }
}