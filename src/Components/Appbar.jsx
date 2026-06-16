import logo from '../assets/capture-it-logo.png';
import { useNavigate } from 'react-router-dom';

const Appbar = () => {
  const navigate = useNavigate();

  const handleHomeNav = () => {
    navigate('/');
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-neu-bg/80 backdrop-blur-sm">
        <div className="flex items-center justify-center py-3 px-4">
          <div
            className="w-[200px] sm:w-[250px] md:w-[350px] lg:w-[400px] cursor-pointer"
            onClick={handleHomeNav}
          >
            <img
              src={logo}
              alt="Capture It Logo"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="h-[72px]" />
    </>
  );
};

export default Appbar;

// ============================================
// FILE: Appbar.jsx
// PURPOSE: Fixed navigation bar at the top of most pages with the app logo
// HOW IT WORKS:
//   - Renders a fixed-position bar at the top with a blurred background
//   - Shows the Capture-It logo, which is clickable and navigates to the home page
//   - Uses responsive widths (200px on mobile, up to 400px on large screens)
//   - Adds a 72px spacer div below to prevent content from hiding behind the fixed bar
// CONNECTS TO: React Router (for navigation), capture-it-logo.png asset
// USER IMPACT: Users always see the logo at the top. Clicking it takes them back to the home page.
//   The blurred background lets page content show through for a modern look.
// ============================================
