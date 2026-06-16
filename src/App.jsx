import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './Pages/CreateRoom';
import Home from './Pages/Home';
import EventRoom from './Pages/EventRoom';
import QrCodeScan from './Pages/QrCodeScan';
import UserLogin from './Pages/UserLogin';
import SchemaMarkup from './Components/SchemaMarkup';



function App() {
  return (
    <Router>
       <SchemaMarkup />
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

// ============================================
// FILE: App.jsx
// PURPOSE: Root component that sets up routing for the entire application
// HOW IT WORKS: Uses React Router to map URL paths to page components.
//   - "/" shows the Home page (landing)
//   - "/create-room" shows the CreateRoom page (make new event)
//   - "/QR-Scan" shows the QR code scanner page
//   - "/event-room/:eventCode" shows the EventRoom (main event page)
//   - "/user/:eventCode" shows the UserLogin page (guest login)
//   Also renders SchemaMarkup for SEO on every page.
// CONNECTS TO: Home, CreateRoom, EventRoom, QrCodeScan, UserLogin, SchemaMarkup
// USER IMPACT: This file decides which page appears when a user visits any URL in the app.
// ============================================
