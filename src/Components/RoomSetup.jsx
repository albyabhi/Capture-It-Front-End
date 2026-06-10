import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoomSetup = ({ eventCode, setEventCode }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleJoinEvent = async () => {
    if (eventCode.trim() === '') {
      alert('Please enter an event code!');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/room/check-room/${eventCode}`);
        await response.json();

        if (response.status === 200) {
        navigate(`/user/${eventCode}`);
      } else {
        alert('Room not found, please check the event code.');
      }
    } catch (error) {
      console.error('Error checking room:', error);
      alert('An error occurred while checking the room.');
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-room');
  };

  const handleQrCode = () => {
    navigate('/QR-Scan');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-neu-bg">
      <h3 className="text-lg font-medium text-neu-accent mb-6">
        Join or Create Event Room
      </h3>

      <input
        type="text"
        placeholder="Event Code"
        value={eventCode}
        onChange={(e) => setEventCode(e.target.value)}
        className="neu-input w-full max-w-[400px] px-4 py-3 text-neu-text placeholder-neu-text-muted/60 mb-4 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
      />

      <button
        onClick={handleJoinEvent}
        className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base mb-4"
      >
        Join Event Room
      </button>

      <button
        onClick={handleQrCode}
        className="neu-btn-outline w-full max-w-[400px] px-6 py-3 font-medium text-base mb-4"
      >
        Scan QR Code
      </button>

      <div className="neu-divider-label w-full max-w-[400px] my-2">
        <span>OR</span>
      </div>

      <button
        onClick={handleCreateEvent}
        className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base"
      >
        Create Event Room
      </button>
    </div>
  );
};

RoomSetup.propTypes = {
  eventCode: PropTypes.string.isRequired,
  setEventCode: PropTypes.func.isRequired,
};

export default RoomSetup;
