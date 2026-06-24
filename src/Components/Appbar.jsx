import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import logo from '../assets/capture-it-logo.png';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

const NAV_LINKS = [
  { path: '/', label: 'Home', public: true },
  { path: '/create-room', label: 'Create Event', public: false },
  { path: '/QR-Scan', label: 'Scan', public: true },
];

const NavLink = ({ path, label }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
        isActive
          ? 'neu-pressed-sm text-neu-accent'
          : 'text-neu-text-muted hover:text-neu-text hover:neu-btn'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  );
};

const Appbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-neu-bg border-b border-white/20"
        style={{
          boxShadow:
            '0 6px 18px rgba(163, 177, 198, 0.3), 0 -2px 6px rgba(255, 255, 255, 0.7)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
          <Link
            to="/"
            className="flex-shrink-0 w-[120px] sm:w-[130px] md:w-[140px]"
            aria-label="Go to home"
          >
            {logoError ? (
              <span className="text-lg font-bold text-neu-accent">
                Capture-It
              </span>
            ) : (
              <img
                src={logo}
                alt="Capture It Logo"
                className="w-full h-auto"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(
              (link) =>
                (link.public || isAuthenticated) && (
                  <NavLink key={link.path} path={link.path} label={link.label} />
                )
            )}
          </div>

          <div className="flex items-center gap-2">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="neu-btn px-4 py-2 text-sm font-medium text-neu-text"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                      className="neu-btn-accent px-4 py-2 text-sm font-medium text-white"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="neu-icon-btn p-2 sm:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="h-[72px]" />

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
};

export default Appbar;
