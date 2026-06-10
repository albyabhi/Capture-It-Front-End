import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const { eventCode } = useParams();
  const [fullName, setFullName] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
        const data = await response.json();

        if (response.status === 200) {
          setRoomData(data.room);
        } else {
          setError('Room not found');
        }
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError('An error occurred while fetching the room data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [apiUrl, eventCode]);

  const handleLogin = async () => {
    if (fullName.trim() === '') {
      alert('Please enter your full name!');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, eventCode }),
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;
        localStorage.setItem('authToken', token);

        const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];
        if (!recentRooms.includes(eventCode)) {
          recentRooms.push(eventCode);
        }
        localStorage.setItem('recent-rooms', JSON.stringify(recentRooms));

        navigate(`/event-room/${eventCode}`);
      } else {
        alert('Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neu-bg">
        <div className="neu-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neu-bg">
        <div className="neu-card max-w-md w-full mx-4 text-center">
          <h3 className="text-lg font-medium text-neu-error">{error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neu-bg px-4">
      {roomData && (
        <div className="text-center mb-6 max-w-[400px] w-full">
          <h2 className="text-xl sm:text-2xl font-semibold text-neu-accent">
            Event Name: {roomData.event_name}
          </h2>
        </div>
      )}

      <input
        type="text"
        placeholder="Your Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="neu-input w-full max-w-[400px] px-4 py-3 text-neu-text placeholder-neu-text-muted/60 mb-4 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
      />

      <button
        onClick={handleLogin}
        className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base"
      >
        Login
      </button>
    </div>
  );
};

export default UserLogin;
