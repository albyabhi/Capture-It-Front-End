import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import Appbar from '../Components/Appbar';

const QrCodeScan = () => {
  const [qrData, setQrData] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleRoomEnter = useCallback(() => {
    const token = localStorage.getItem("guestToken");

    let roomCode = qrData;
    try {
      const url = new URL(qrData);
      if (url.origin === window.location.origin) {
        navigate(url.pathname);
        return;
      }
    } catch {
      // Not a URL — use as raw room code
    }

    const recentRooms = JSON.parse(localStorage.getItem('recent-rooms')) || [];
    if (!recentRooms.includes(roomCode)) {
      recentRooms.push(roomCode);
      localStorage.setItem('recent-rooms', JSON.stringify(recentRooms));
    }

    if (!token) {
      navigate(`/user/${roomCode}`);
    } else {
      navigate(`/event-room/${roomCode}`);
    }
  }, [qrData, navigate]);

  useEffect(() => {
    if (qrData) {
      handleRoomEnter();
    }
  }, [qrData, handleRoomEnter]);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let isMounted = true;

    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
      if (result && isMounted) {
        setQrData(result.getText());
      } else if (error && error.name !== 'NotFoundException') {
        console.warn('QR Scan Error:', error.message);
      }
    });

    return () => {
      isMounted = false;
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <Appbar />
      <main className="max-w-lg mx-auto text-center px-5 pt-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-neu-accent mb-6">
          Scan QR Code
        </h2>

        <div className="neu-inset p-8 inline-block mb-8">
          <video
            ref={videoRef}
            className="w-full max-w-[400px] rounded-[10px]"
          />
        </div>

        {qrData && (
          <div className="neu-card mt-5">
            <h4 className="text-lg font-medium text-neu-text mb-2">
              Scanned QR Code:
            </h4>
            <p className="text-base text-neu-text mt-2">
              {qrData}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QrCodeScan;

// ============================================
// FILE: QrCodeScan.jsx
// PURPOSE: Camera-based QR code scanner that reads event codes from QR codes
// HOW IT WORKS:
//   1. Uses @zxing/library to access the device camera and continuously scan for QR codes
//   2. When a QR code is detected, checks if it's a full URL or a raw room code
//   3. If it's a URL from this app (same origin), navigates directly to that path
//   4. If it's a raw code, navigates to /user/{code} for login
//   5. Saves the scanned code to recent rooms in browser storage
// CONNECTS TO: Appbar, @zxing/library (QR scanner), UserLogin/EventRoom pages, localStorage
// USER IMPACT: Users point their camera at a QR code (from an event flyer or screen)
//   and the app automatically detects the code and takes them to the right event.
// ============================================
