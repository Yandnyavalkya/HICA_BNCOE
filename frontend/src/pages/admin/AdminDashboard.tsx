import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const { data: teamCount, isLoading: teamLoading } = useQuery({
    queryKey: ['team-count'],
    queryFn: async () => {
      const res = await api.get('/team');
      return res.data.length;
    },
  });

  const { data: eventsCount, isLoading: eventsLoading } = useQuery({
    queryKey: ['events-count'],
    queryFn: async () => {
      const res = await api.get('/events');
      return res.data.length;
    },
  });

  const { data: galleryCount, isLoading: galleryLoading } = useQuery({
    queryKey: ['gallery-count'],
    queryFn: async () => {
      const res = await api.get('/gallery');
      return res.data.length;
    },
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at center, #1a1a1a, #000000)',
      padding: '120px 20px 40px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#993fea' }}>
            Admin Dashboard
          </h1>
          <Link 
            to="/" 
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(45deg, #ff00ff, #00d4ff)',
              borderRadius: '5px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            View Site
          </Link>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <Link 
            to="/admin/team"
            style={{
              background: '#2b0949',
              borderRadius: '10px',
              padding: '30px',
              textDecoration: 'none',
              color: 'white',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Team Members</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00d4ff', margin: '10px 0' }}>
              {teamLoading ? '...' : (teamCount ?? 0)}
            </p>
            <p style={{ color: '#ccc', marginTop: '10px' }}>Manage team →</p>
          </Link>

          <Link 
            to="/admin/events"
            style={{
              background: '#2b0949',
              borderRadius: '10px',
              padding: '30px',
              textDecoration: 'none',
              color: 'white',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📅</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Events</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'rgb(97, 225, 51)', margin: '10px 0' }}>
              {eventsLoading ? '...' : (eventsCount ?? 0)}
            </p>
            <p style={{ color: '#ccc', marginTop: '10px' }}>Manage events →</p>
          </Link>

          <Link 
            to="/admin/gallery"
            style={{
              background: '#2b0949',
              borderRadius: '10px',
              padding: '30px',
              textDecoration: 'none',
              color: 'white',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🖼️</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Gallery Images</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#993fea', margin: '10px 0' }}>
              {galleryLoading ? '...' : (galleryCount ?? 0)}
            </p>
            <p style={{ color: '#ccc', marginTop: '10px' }}>Manage gallery →</p>
          </Link>

          <Link 
            to="/admin/config"
            style={{
              background: '#2b0949',
              borderRadius: '10px',
              padding: '30px',
              textDecoration: 'none',
              color: 'white',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚙️</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Site Config</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff6b35', margin: '10px 0' }}>
              ⚙️
            </p>
            <p style={{ color: '#ccc', marginTop: '10px' }}>Configure site →</p>
          </Link>
        </div>

        <div style={{
          background: '#2b0949',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <Link
              to="/admin/team"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
                borderRadius: '5px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Team Manager
            </Link>
            <Link
              to="/admin/events"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, rgb(97, 225, 51), rgb(76, 175, 40))',
                borderRadius: '5px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Event Manager
            </Link>
            <Link
              to="/admin/gallery"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #993fea, #7a2fb8)',
                borderRadius: '5px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Gallery Manager
            </Link>
            <Link
              to="/admin/config"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #ff6b35, #ff4500)',
                borderRadius: '5px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Site Config
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
