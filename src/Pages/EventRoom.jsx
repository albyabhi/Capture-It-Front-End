import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setRoomData, setLoading, setError, setEventCode } from '../Store/roomSlice';
import { setUserData } from '../Store/userSlice';
import Capture from '../Components/Capture';
import Album from '../Components/Album';
import { fetchImages } from '../Store/albumSlice';
import Appbar from '../Components/Appbar';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, User, Key, ChevronDown, ChevronUp } from 'lucide-react';

const EventRoom = () => {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomData, loading, error } = useSelector((state) => state.room);
  const { userData } = useSelector((state) => state.user);
  const { isAuthenticated, account, loading: authLoading } = useSelector((state) => state.auth);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayName = userData?.fullName || account?.username || '';
  const isAccountUser = !!account;

  const refreshImages = () => {
    dispatch(fetchImages(eventCode));
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const guestToken = localStorage.getItem('guestToken');

    if (authToken && authLoading) {
      return;
    }

    const fetchRoomAndUserData = async () => {
      dispatch(setLoading(true));
      try {
        const roomResponse = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
        const roomData = await roomResponse.json();

        if (roomResponse.status === 200) {
          dispatch(setRoomData(roomData.room));
          dispatch(setEventCode(eventCode));
        } else {
          dispatch(setError('Room not found'));
          return;
        }

        if (authToken && isAuthenticated) {
          dispatch(setUserData({ fullName: account.username, isAccountUser: true }));
        } else if (guestToken) {
          const userResponse = await fetch(`${apiUrl}/user/user-data`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${guestToken}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            dispatch(setUserData(userData.user));
          } else if (userResponse.status === 401) {
            console.warn('Session expired, redirecting to login');
            localStorage.removeItem('guestToken');
            navigate(`/user/${eventCode}`);
            return;
          } else {
            console.warn('Failed to fetch user data:', userResponse.status);
          }
        } else {
          navigate(`/user/${eventCode}`);
          return;
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        dispatch(setError('An error occurred while fetching data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchRoomAndUserData();
  }, [apiUrl, eventCode, navigate, dispatch, isAuthenticated, account, authLoading]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomData?.room_code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.warn('Clipboard API not available');
    }
  };

  const toggleQRCode = async () => {
    if (showQRCode) {
      setShowQRCode(false);
      return;
    }
    if (!qrCodeImage) {
      const url = `${window.location.origin}/user/${roomData?.room_code}`;
      try {
        const qr = await QRCode.toDataURL(url, { width: 512, margin: 2 });
        setQrCodeImage(qr);
      } catch (err) {
        console.error('QR Code generation failed:', err);
      }
    }
    setShowQRCode(true);
  };

  if (loading || (localStorage.getItem('authToken') && authLoading)) {
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
    <div>
      <Appbar />
      <div className="flex flex-col items-center justify-center px-4 pt-10">
        {roomData ? (
          <div className="text-center max-w-[600px] w-full">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neu-accent mb-4">
              {roomData.event_name}
            </h2>
          </div>
        ) : (
          <p className="neu-empty-state">
            No room data available
          </p>
        )}

        {roomData && (
          <div className="neu-card w-full max-w-[600px] mb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-neu-text-muted shrink-0" />
                <span className="text-sm text-neu-text">
                  <span className="text-neu-text-muted">Owner:</span>{' '}
                  <span className="font-medium">{roomData.owner_name}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Key size={18} className="text-neu-text-muted shrink-0" />
                <span className="text-sm text-neu-text font-mono font-medium">
                  {roomData.room_code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="neu-icon-btn p-1.5 ml-auto"
                  title="Copy room code"
                >
                  {copied ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} className="text-neu-text-muted" />
                  )}
                </button>
              </div>

              <div>
                <button
                  onClick={toggleQRCode}
                  className="flex items-center gap-2 text-sm text-neu-accent font-medium hover:underline"
                >
                  <QrCode size={16} />
                  {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                  {showQRCode ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showQRCode && qrCodeImage && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={qrCodeImage}
                      alt="QR Code to join room"
                      className="w-[200px] h-[200px] neu-raised p-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {displayName && (
          <div className="text-center max-w-[600px] w-full mt-2">
            <h4 className="text-base sm:text-lg font-medium text-neu-text line-clamp-2 break-words">
              {isAccountUser ? (
                <>Welcome, {displayName}</>
              ) : (
                <>Hi {displayName}, upload your images to {roomData?.event_name} Album</>
              )}
            </h4>
          </div>
        )}

        <div className="mt-6">
          <Capture eventCode={eventCode} refreshImages={refreshImages} />
        </div>

        <div className="mt-6 w-full max-w-4xl">
          <Album eventCode={eventCode} />
        </div>
      </div>
    </div>
  );
};

export default EventRoom;

// ============================================
// FILE: EventRoom.jsx
// PURPOSE: Main event page where authenticated users upload and view photos
// HOW IT WORKS:
//   1. Checks for auth token - redirects to home if not logged in
//   2. Fetches room data (event name) and user data from the server using JWT token
//   3. Stores both in Redux state so other components can access them
//   4. Renders Capture component (for uploading photos) and Album component (for viewing them)
//   5. Shows loading spinner while fetching, error card if something goes wrong
// CONNECTS TO: Appbar, Capture, Album, Redux roomSlice/userSlice/albumSlice, backend APIs
// USER IMPACT: This is the main screen guests see after logging in. They can take/upload photos
//   and see the shared album growing as everyone adds their photos.
// ============================================
