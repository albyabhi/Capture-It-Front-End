import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from './Store/authSlice';
import CreateRoom from './Pages/CreateRoom';
import Home from './Pages/Home';
import EventRoom from './Pages/EventRoom';
import QrCodeScan from './Pages/QrCodeScan';
import UserLogin from './Pages/UserLogin';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import ProtectedRoute from './Components/ProtectedRoute';
import SchemaMarkup from './Components/SchemaMarkup';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Router>
      <SchemaMarkup />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-room" element={<ProtectedRoute><CreateRoom /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/QR-Scan" element={<QrCodeScan />} />
        <Route path="/event-room/:eventCode" element={<EventRoom />} />
        <Route path="/user/:eventCode" element={<UserLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
