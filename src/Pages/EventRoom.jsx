import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setRoomData, setLoading, setError, setEventCode } from '../Store/roomSlice';
import { setUserData } from '../Store/userSlice';
import Capture from '../Components/Capture';
import Album from '../Components/Album';
import { fetchImages } from '../Store/albumSlice';
import Appbar from '../Components/Appbar';

const EventRoom = () => {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomData, loading, error } = useSelector((state) => state.room);
  const { userData } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const refreshImages = () => {
    dispatch(fetchImages(eventCode));
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
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
        }

        const userResponse = await fetch(`${apiUrl}/user/user-data`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          dispatch(setUserData(userData.user));
        } else {
          console.error('Failed to fetch user data:', userResponse.status);
          dispatch(setError('Failed to fetch user data'));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        dispatch(setError('An error occurred while fetching data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchRoomAndUserData();
  }, [apiUrl, eventCode, navigate, dispatch]);

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
    <div>
      <Appbar />
      <div className="flex flex-col items-center justify-center px-4 pt-2">
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

        {userData && (
          <div className="text-center max-w-[600px] w-full mt-5">
            <h4 className="text-base sm:text-lg font-medium text-neu-text line-clamp-2 break-words">
              Hi {userData.fullName}, upload your images to {roomData?.event_name} Album
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
