import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Camera, Images, Download, Calendar } from 'lucide-react';
import Appbar from '../Components/Appbar';
import Footer from '../Components/Footer';
import { clearImages } from '../Store/albumSlice';
import { useSelector, useDispatch } from 'react-redux';

const FEATURES = [
  {
    icon: Camera,
    title: 'Capture',
    desc: 'Take photos from your phone camera or upload from your gallery.',
  },
  {
    icon: Images,
    title: 'Album',
    desc: 'All event photos in one shared album, organized automatically.',
  },
  {
    icon: Download,
    title: 'Export',
    desc: 'Download the complete album as a PDF to keep forever.',
  },
];

const Home = () => {
  const [eventCode, setEventCode] = useState('');
  const [recentRooms, setRecentRooms] = useState([]);
  const images = useSelector((state) => state.album.images);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (images.length > 0) {
      dispatch(clearImages());
    }

    const clearExpiredToken = (key) => {
      const token = localStorage.getItem(key);
      if (!token) return;
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    };
    clearExpiredToken('authToken');
    clearExpiredToken('guestToken');

    const saved = JSON.parse(localStorage.getItem('recent-rooms')) || [];
    if (saved.length > 0) {
      Promise.all(
        saved.map(async (code) => {
          try {
            const res = await fetch(`${apiUrl}/room/check-room/${code}`);
            if (res.ok) {
              const data = await res.json();
              return { eventCode: code, eventName: data.room.event_name };
            }
          } catch {
            /* ignore */
          }
          return null;
        })
      ).then((results) => {
        setRecentRooms(results.filter(Boolean).reverse().slice(0, 3));
      });
    }
  }, [apiUrl, dispatch, images.length]);

  const handleJoin = async () => {
    if (eventCode.trim() === '') return;
    try {
      const res = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
      if (res.status === 200) {
        navigate(`/user/${eventCode}`);
      } else {
        alert('Room not found. Check the event code and try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
  };

  const handleRecentClick = (code) => {
    const token = localStorage.getItem('guestToken');
    if (!token) {
      navigate(`/user/${code}`);
    } else {
      navigate(`/event-room/${code}`);
    }
  };

  return (
    <div className="min-h-screen bg-neu-bg flex flex-col">
      <Appbar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12">
       

        <p className="text-base sm:text-lg text-neu-text-muted text-center max-w-md mb-8 animate-neu-slide-1">
          One event. One album. Everyone&apos;s photos.
        </p>

        <div className="flex flex-col items-center gap-3 w-full max-w-[400px] animate-neu-slide-2">
          <input
            type="text"
            placeholder="Enter Event Code"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            className="neu-hero-input focus-visible:outline-none"
          />
          <button
            onClick={handleJoin}
            className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base"
          >
            Join Event
          </button>
          <button
            onClick={() => navigate('/create-room')}
            className="text-sm text-neu-accent font-medium mt-1 hover:underline"
          >
            Create a new event &rarr;
          </button>
          {isAuthenticated && (
            <button
              onClick={() => navigate('/profile?tab=events')}
              className="flex items-center gap-2 text-sm text-neu-text-muted font-medium mt-2 hover:text-neu-accent transition-colors"
            >
              <Calendar size={14} />
              My Events
            </button>
          )}
        </div>
      </main>

      {/* Feature Strip */}
      <section className="max-w-3xl w-full mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="neu-raised-sm p-5 text-center flex flex-col items-center gap-2"
            >
              <f.icon size={24} className="text-neu-accent" strokeWidth={1.8} />
              <h3 className="text-base font-semibold text-neu-text">{f.title}</h3>
              <p className="text-sm text-neu-text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Rooms */}
      {recentRooms.length > 0 && (
        <section className="max-w-3xl w-full mx-auto px-4 pb-10">
          <h3 className="text-sm font-medium text-neu-text-muted mb-3 text-center">
            Recent Events
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {recentRooms.map((room) => (
              <button
                key={room.eventCode}
                onClick={() => handleRecentClick(room.eventCode)}
                className="neu-raised-sm px-4 py-3 text-left cursor-pointer neu-hover-lift min-w-[160px]"
              >
                <span className="block text-sm font-medium text-neu-text truncate">
                  {room.eventName}
                </span>
                <span className="block text-xs text-neu-text-muted mt-0.5">
                  {room.eventCode}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;

// ============================================
// FILE: Home.jsx
// PURPOSE: Landing page where users enter an event code or create a new event
// HOW IT WORKS: 
//   1. On load, clears any previous album images and checks if the user's login token is expired
//   2. Loads "recent events" from browser storage and fetches their names from the server
//   3. Shows a text input for entering an event code, validates it exists, then navigates to login
//   4. Shows recent event cards that users can click to quickly rejoin past events
// CONNECTS TO: Appbar (header), Footer (footer), Redux albumSlice (clear images), UserLogin/EventRoom pages
// USER IMPACT: This is the first screen users see. They can type an event code to join,
//   click "Create a new event" to start a new room, or click a recent event to quickly return.
// ============================================
