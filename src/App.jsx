import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './Pages/CreateRoom';
import Home from './Pages/Home';
import EventRoom from './Pages/EventRoom';
import QrCodeScan from './Pages/QrCodeScan';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/" element={<Home />} />
        <Route path="/QR-Scan" element={<QrCodeScan />} />
        <Route path="/event-room/:eventCode" element={<EventRoom />} />      </Routes>
    </Router>
  );
}

export default App;
