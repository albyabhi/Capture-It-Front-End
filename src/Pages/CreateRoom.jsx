import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import axios from "axios";
import QRCode from "qrcode";
import { useNavigate } from 'react-router-dom';
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

  const handleCreateRoom = async () => {
    if (eventName.trim() === "" || ownerName.trim() === "") {
      setErrorMessage("Please enter all required details.");
      return;
    }

    setLoading(true);
    setProgress(10); // Start with an initial progress value
    try {
      const response = await axios.post(`${apiUrl}/room/create`, {
        eventName,
        ownerName,
      });
      setProgress(50);

      const room = response.data.room;
      setRoomData(room);
      setRoomCode(room.room_code);

      await generateQrCode(room.room_code);
      setProgress(90); // Update progress as QR code is being generated
      setEnterButton(true);
      setSuccessMessage("Room created successfully!");
      setProgress(100); // Mark as complete
    } catch (error) {
      console.error("Error creating room:", error);
      setErrorMessage("Failed to create the room. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000); // Reset progress after some delay
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
    const token = localStorage.getItem("authToken");
    console.log(token);

    const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];
    if (!recentRooms.includes(roomCode)) {
      recentRooms.push(roomCode);
    }
    localStorage.setItem('recent-rooms', JSON.stringify(recentRooms));

    if (!token || token === '') {
      navigate(`/user/${roomCode}`);
    } else {
      navigate(`/event-room/${roomCode}`);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          marginBottom: '20px'
        }}
      >
        <Appbar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#EFFFFD",
          padding: "16px",
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Create Event Room
        </Typography>

        {!roomData && ( // Only show the input fields if roomData is null
          <>
            <TextField
              label="Event Name"
              variant="outlined"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              fullWidth
              sx={{ marginBottom: "16px", maxWidth: "400px" }}
              error={!!errorMessage}
              helperText={errorMessage}
              aria-label="Event Name"
            />
            <TextField
              label="Room Owner Name"
              variant="outlined"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              fullWidth
              sx={{ marginBottom: "16px", maxWidth: "400px" }}
              error={!!errorMessage}
              helperText={errorMessage}
              aria-label="Room Owner Name"
            />
            <Box sx={{ width: "100%", maxWidth: "400px", marginBottom: "16px" }}>
              {loading && <LinearProgress variant="determinate" value={progress} />}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateRoom}
              fullWidth
              sx={{ maxWidth: "400px", marginBottom: "16px" }}
              disabled={loading}
            >
              {loading ? "Creating Room..." : "Create Room"}
            </Button>
          </>
        )}

        {roomData && EnterButton && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleRoomNav}
            fullWidth
            sx={{ maxWidth: "400px", marginBottom: "16px" }}
          >
            Enter Room
          </Button>
        )}

        {successMessage && (
          <Snackbar
            open={true}
            autoHideDuration={3000}
            message={successMessage}
            onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
        )}

        {roomData && roomCode && (
          <Box sx={{ marginTop: "16px", textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Room Code: {roomCode}
            </Typography>
            {qrCodeImage && (
              <img
                src={qrCodeImage}
                alt="QR Code"
                style={{ marginTop: "16px", width: "512px", height: "512px" }}
              />
            )}
            <Box sx={{ marginTop: "16px" }}>
              <Button variant="contained" color="primary" onClick={saveQRCode}>
                Save QR
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CreateRoom;

