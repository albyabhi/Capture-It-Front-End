import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Recent_Rooms = ({ onRoomsFetched }) => {
  const [roomDetails, setRoomDetails] = useState([]);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const recentRooms =
        JSON.parse(localStorage.getItem("recent-rooms")) || [];

      if (recentRooms.length === 0) {
        console.warn("No recent rooms found in localStorage");
        return;
      }

      try {
        const roomDataPromises = recentRooms.map(async (eventCode) => {
          try {
            const response = await fetch(
              `${apiUrl}/room/check-room/${eventCode}`
            );
            if (response.ok) {
              const data = await response.json();
              return { eventCode, eventName: data.room.event_name };
            } else {
              console.error(`Room not found for eventCode: ${eventCode}`);
              return null;
            }
          } catch (error) {
            console.error(
              `Error fetching data for eventCode: ${eventCode}`,
              error
            );
            return null;
          }
        });

        const details = (await Promise.all(roomDataPromises))
          .filter(Boolean)
          .reverse()
          .slice(0, 3);

        setRoomDetails(details);
        if (onRoomsFetched) {
          onRoomsFetched(details);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [apiUrl]);

  const handleRoomClick = (eventCode) => {
    const token = localStorage.getItem("guestToken");
    if (!token || token === "") {
      navigate(`/user/${eventCode}`);
    } else {
      navigate(`/event-room/${eventCode}`);
    }
  };

  return (
    <div className="max-w-[400px] w-full text-center">
      <h3 className="text-lg font-medium text-neu-accent mb-4">
        Recent logins
      </h3>
      {roomDetails.length > 0 ? (
        <ul className="list-none p-0 m-0 space-y-3">
          {roomDetails.map((room, index) => (
            <li
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleRoomClick(room.eventCode)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRoomClick(room.eventCode);
                }
              }}
              className="neu-raised-sm px-4 py-3 cursor-pointer neu-hover-lift text-left focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
            >
              <span className="block text-neu-text font-medium">
                {room.eventName}
              </span>
              <span className="block text-neu-text-muted text-sm mt-1">
                Code: {room.eventCode}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="neu-empty-state">
          No recent rooms available.
        </p>
      )}
    </div>
  );
};

Recent_Rooms.propTypes = {
  onRoomsFetched: PropTypes.func,
};

export default Recent_Rooms;

// ============================================
// FILE: Recent_Rooms.jsx
// PURPOSE: Reusable component that shows a list of recently visited event rooms
// HOW IT WORKS:
//   1. Reads the "recent-rooms" list from browser localStorage (array of event codes)
//   2. For each code, fetches the room name from the server
//   3. Shows up to 3 most recent rooms as clickable cards
//   4. Clicking a room navigates to login (if not logged in) or event room (if logged in)
//   5. Calls onRoomsFetched callback with the room details after loading
// CONNECTS TO: backend /room/check-room API, localStorage, React Router, Home page
// USER IMPACT: Users see their recently visited events as quick-access cards,
//   so they can jump back into an event without typing the code again.
// ============================================
