import { useState } from "react";
import axios from "axios";
import QRCode from "qrcode";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Appbar from "../Components/Appbar";

const CreateRoom = () => {
  const [eventName, setEventName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [EnterButton, setEnterButton] = useState(false);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [roomCode, setRoomCode] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.auth);

  const handleCreateRoom = async () => {
    if (eventName.trim() === "") {
      setErrorMessage("Please enter an event name.");
      return;
    }

    const finalOwnerName = account?.username || ownerName;
    if (!finalOwnerName || finalOwnerName.trim() === "") {
      setErrorMessage("Please enter a room owner name.");
      return;
    }

    setLoading(true);
    setProgress(10);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${apiUrl}/room/create`,
        { eventName, ownerName: finalOwnerName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(50);

      const room = response.data.room;
      setRoomData(room);
      setRoomCode(room.room_code);

      const fullUrl = `${window.location.origin}/user/${room.room_code}`;
      await generateQrCode(fullUrl);
      setProgress(90);
      setEnterButton(true);
      setSuccessMessage("Room created successfully!");
      setProgress(100);
    } catch (error) {
      console.error("Error creating room:", error);
      setErrorMessage("Failed to create the room. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const generateQrCode = async (text) => {
    try {
      const qrImageUrl = await QRCode.toDataURL(text, {
        width: 512,
        margin: 2,
      });
      setQrCodeImage(qrImageUrl);
    } catch (error) {
      console.error("QR Code generation failed:", error);
    }
  };

  const saveQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement("a");
      link.href = qrCodeImage;
      link.download = "room-qr-code.png";
      link.click();
    } else {
      alert("QR code is not ready!");
    }
  };

  const handleRoomNav = () => {
    const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];
    if (!recentRooms.includes(roomCode)) {
      recentRooms.push(roomCode);
    }
    localStorage.setItem('recent-rooms', JSON.stringify(recentRooms));
    navigate(`/user/${roomCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Appbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-neu-bg px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-neu-accent mb-6">
          Create Event Room
        </h2>

        {successMessage && (
          <div className="neu-alert-success w-full max-w-[400px] mb-4 text-center font-medium">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="neu-alert-error w-full max-w-[400px] mb-4 text-center font-medium">
            {errorMessage}
          </div>
        )}

        {!roomData && (
          <>
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="neu-input w-full max-w-[400px] px-4 py-3 text-neu-text placeholder-neu-text-muted/60 mb-4 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
              aria-label="Event Name"
            />
            {!account && (
              <input
                type="text"
                placeholder="Room Owner Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="neu-input w-full max-w-[400px] px-4 py-3 text-neu-text placeholder-neu-text-muted/60 mb-4 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
                aria-label="Room Owner Name"
              />
            )}

            <div className="w-full max-w-[400px] mb-4">
              {loading && (
                <div className="neu-progress-track">
                  <div
                    className="neu-progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Room..." : "Create Room"}
            </button>
          </>
        )}

        {roomData && EnterButton && (
          <button
            onClick={handleRoomNav}
            className="neu-btn-accent w-full max-w-[400px] px-6 py-3 text-white font-medium text-base mb-4"
          >
            Enter Room
          </button>
        )}

        {roomData && roomCode && (
          <div className="mt-4 text-center">
            <h4 className="text-lg font-medium text-neu-text mb-4">
              Room Code: {roomCode}
            </h4>
            {qrCodeImage && (
              <img
                src={qrCodeImage}
                alt="QR Code"
                className="mt-4 w-[256px] sm:w-[384px] md:w-[512px] h-auto neu-raised p-2"
              />
            )}
            <div className="mt-4">
              <button
                onClick={saveQRCode}
                className="neu-btn-accent px-6 py-3 text-white font-medium text-base"
              >
                Save QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoom;
