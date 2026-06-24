import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SESSION_KEY_PREFIX = 'capture-it-session-';

const UserLogin = () => {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, account } = useSelector((state) => state.auth);
  const [fullName, setFullName] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionName, setSessionName] = useState(null);
  const [autoLogging, setAutoLogging] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
        const data = await response.json();

        if (response.status !== 200) {
          setError('Room not found');
          setLoading(false);
          return;
        }

        setRoomData(data.room);

        if (isAuthenticated && account) {
          setLoading(false);
          navigate(`/event-room/${eventCode}`);
          return;
        }

        const savedSession = localStorage.getItem(`${SESSION_KEY_PREFIX}${eventCode}`);
        if (savedSession) {
          try {
            const { fullName: savedName } = JSON.parse(savedSession);
            setSessionName(savedName);
          } catch {
            localStorage.removeItem(`${SESSION_KEY_PREFIX}${eventCode}`);
          }
        }
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError('An error occurred while fetching the room data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [apiUrl, eventCode, isAuthenticated, account, navigate]);

  const doLogin = async (nameToLogin) => {
    const response = await fetch(`${apiUrl}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: nameToLogin, eventCode }),
    });

    if (!response.ok) throw new Error('Login failed');

    const result = await response.json();
    localStorage.setItem('guestToken', result.token);
    localStorage.setItem(
      `${SESSION_KEY_PREFIX}${eventCode}`,
      JSON.stringify({ fullName: nameToLogin, token: result.token })
    );

    const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];
    if (!recentRooms.includes(eventCode)) {
      recentRooms.push(eventCode);
    }
    localStorage.setItem('recent-rooms', JSON.stringify(recentRooms));

    navigate(`/event-room/${eventCode}`);
  };

  const handleLogin = async () => {
    if (fullName.trim() === '') {
      alert('Please enter your full name!');
      return;
    }

    try {
      await doLogin(fullName.trim());
    } catch (err) {
      console.error('Error during login:', err);
      alert('An error occurred during login.');
    }
  };

  const handleContinue = async () => {
    setAutoLogging(true);
    try {
      await doLogin(sessionName);
    } catch (err) {
      console.error('Error during auto-login:', err);
      setAutoLogging(false);
      setSessionName(null);
      localStorage.removeItem(`${SESSION_KEY_PREFIX}${eventCode}`);
      alert('Session expired. Please enter your name again.');
    }
  };

  const handleSwitchUser = () => {
    localStorage.removeItem(`${SESSION_KEY_PREFIX}${eventCode}`);
    setSessionName(null);
    setFullName('');
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

      {sessionName ? (
        <>
          <button
            onClick={handleContinue}
            disabled={autoLogging}
            className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {autoLogging ? 'Entering...' : `Continue as ${sessionName}`}
          </button>
          <button
            onClick={handleSwitchUser}
            disabled={autoLogging}
            className="mt-3 text-sm text-neu-accent font-medium hover:underline disabled:opacity-50"
          >
            Not you?
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="neu-input w-full max-w-[400px] px-4 py-3 text-neu-text placeholder-neu-text-muted/60 mb-4 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
          />

          <button
            onClick={handleLogin}
            className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base"
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default UserLogin;

// ============================================
// FILE: UserLogin.jsx
// PURPOSE: Guest login page where users enter their name to join an event
// HOW IT WORKS:
//   1. Fetches room data to confirm the event exists and show the event name
//   2. Checks browser storage for a saved session (returning user)
//   3. If session exists: shows "Continue as {name}" button for one-click rejoin
//   4. If no session: shows a name input field for first-time login
//   5. On login: sends POST to /user/login, saves JWT token and session locally
//   6. "Not you?" button clears the saved session so a different user can log in
// CONNECTS TO: backend /user/login and /room/check-room APIs, EventRoom page, browser localStorage
// USER IMPACT: Guests arrive here after scanning a QR code. They type their name once,
//   and next time they join the same event they can tap "Continue" to skip re-entering their name.
// ============================================
