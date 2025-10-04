import { useEffect, useState } from 'react'
import VideoCallModal from '../../components/VideoCallModal'

type Companion = { id: string; name: string; avatarUrl?: string; voiceId?: string }

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selected, setSelected] = useState<Companion | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/companions')
      .then(r => r.json())
      .then(data => setCompanions(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('fetch companions failed', err)
        // fallback demo companion
        setCompanions([{ id: 'demo-1', name: 'Demo Companion', avatarUrl: '/avatar.png', voiceId: 'eleven-demo' }])
      })
  }, [])

  async function createRoom() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/video/rooms', { method: 'POST' })
    const data = await res.json()
    setRoomId(data.roomId)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Choose a Companion</h1>
      <div style={{ display: 'flex', gap: 12 }}>
        {companions.map(c => (
          <div key={c.id} style={{ border: '1px solid #ddd', padding: 12, width: 160 }}>
            <img src={c.avatarUrl || '/avatar.png'} alt={c.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
            <h3>{c.name}</h3>
            <button onClick={() => { setSelected(c); createRoom() }}>Start Call</button>
          </div>
        ))}
      </div>

      {selected && roomId && (
        <VideoCallModal roomId={roomId} userId={'user-demo'} companion={selected} onEnd={() => { setSelected(null); setRoomId(null) }} />
      )}
    </div>
  )
}
