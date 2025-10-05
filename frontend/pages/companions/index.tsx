import { useEffect, useState } from 'react';
import VideoCallModal from '../../components/VideoCallModal';

// Import the images you want to use
import robotAvatar from '../../public/robot.jpg';
import catAvatar from '../../public/cyber-cat.jpg';
import gokuAvatar from '../../public/dragon ball z.jpg';

type Companion = { id: string; name: string; avatarUrl?: string; voiceId?: string };

// Create an array of the imported images
const localAvatars = [robotAvatar.src, catAvatar.src, gokuAvatar.src];

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [selected, setSelected] = useState<Companion | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/companions')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Map over the fetched data and assign a local avatar
          const companionsWithAvatars = data.map((companion, index) => ({
            ...companion,
            // Use a local image if available, otherwise fallback to a default
            avatarUrl: localAvatars[index] || '/avatar.png',
          }));
          setCompanions(companionsWithAvatars);
        } else {
          setCompanions([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch companions:', err);
        alert("Could not connect to the backend. Please ensure it's running.");
        setCompanions([]);
      });
  }, []);

  async function createRoom() {
    if (!selected) return;

    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/video/rooms', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      setRoomId(data.roomId);
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Failed to create a video room. Is the backend server running correctly?');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Choose a Companion</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {companions.map(c => (
          <div key={c.id} style={{ border: '1px solid #ddd', padding: 12, width: 160, textAlign: 'center', borderRadius: 8 }}>
            <img src={c.avatarUrl} alt={c.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
            <h3>{c.name}</h3>
            <button onClick={() => { setSelected(c); createRoom(); }}>Start Call</button>
          </div>
        ))}
      </div>

      {selected && roomId && (
        <VideoCallModal roomId={roomId} userId={'user-demo'} companion={selected} onEnd={() => { setSelected(null); setRoomId(null) }} />
      )}
    </div>
  );
}