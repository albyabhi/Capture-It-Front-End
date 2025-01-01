import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './Pages/CreateRoom';
import Home from './Pages/Home';
import EventRoom from './Pages/EventRoom';
import QrCodeScan from './Pages/QrCodeScan';
import UserLogin from './Pages/UserLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/" element={<Home />} />
        <Route path="/QR-Scan" element={<QrCodeScan />} />
        <Route path="/event-room/:eventCode" element={<EventRoom />} />
        <Route path="/user/:eventCode" element={<UserLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
