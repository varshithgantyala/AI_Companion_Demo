import Link from 'next/link';


export default function HomePage() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1>Welcome to AI Companion</h1>
      <p style={{ maxWidth: '600px', margin: '1rem 0 2rem' }}>
        Experience the future of personalized interaction with your very own AI Companion.
        Whether you’re seeking creativity, productivity, or friendly conversation —
        your companion adapts to your needs and learns with you.
      </p>

      <Link href="/companions">
        <button style={{
          background: '#2563eb',
          color: '#fff',
          padding: '0.9rem 2rem',
          borderRadius: '30px',
          fontSize: '1.1rem',
          textDecoration: 'none',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer'
        }}>
          Choose Your Companion
        </button>
      </Link>
    </div>
  );
}