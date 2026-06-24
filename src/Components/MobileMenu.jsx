import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout, resetAuth } from '../Store/authSlice';
import { X, Home, Camera, QrCode, User, Calendar, LogOut } from 'lucide-react';

const MobileMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, account } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(resetAuth());
    localStorage.removeItem('authToken');
    navigate('/');
    onClose();
  };

  const initial = account?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-neu-bg rounded-l-[24px] flex flex-col overflow-y-auto"
            style={{
              boxShadow:
                '-8px 0 24px rgba(163,177,198,0.35), 4px 0 12px rgba(255,255,255,0.5)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex justify-end p-3">
              <button
                onClick={onClose}
                className="neu-icon-btn p-2"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {isAuthenticated && account && (
              <div className="flex items-center gap-3 px-5 pb-4 border-b border-white/30 mx-3">
                <div className="w-10 h-10 rounded-full bg-neu-accent flex items-center justify-center text-white font-semibold text-sm">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neu-text truncate">
                    {account.username}
                  </p>
                  <p className="text-xs text-neu-text-muted truncate">
                    {account.email}
                  </p>
                </div>
              </div>
            )}

            <div className="flex-1 px-3 py-4 space-y-1">
              <button
                onClick={() => handleNav('/')}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neu-text rounded-xl hover:bg-neu-surface-2 transition-colors"
              >
                <Home size={18} />
                Home
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => handleNav('/create-room')}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neu-text rounded-xl hover:bg-neu-surface-2 transition-colors"
                >
                  <Camera size={18} />
                  Create Event
                </button>
              )}

              <button
                onClick={() => handleNav('/QR-Scan')}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neu-text rounded-xl hover:bg-neu-surface-2 transition-colors"
              >
                <QrCode size={18} />
                QR Scan
              </button>

              {isAuthenticated && (
                <>
                  <div className="neu-divider my-2" />
                  <button
                    onClick={() => handleNav('/profile')}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neu-text rounded-xl hover:bg-neu-surface-2 transition-colors"
                  >
                    <User size={18} />
                    Profile
                  </button>
                  <button
                    onClick={() => handleNav('/profile?tab=events')}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neu-text rounded-xl hover:bg-neu-surface-2 transition-colors"
                  >
                    <Calendar size={18} />
                    My Events
                  </button>
                  <div className="neu-divider my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neu-error rounded-xl hover:bg-neu-surface-2 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <div className="neu-divider my-4" />
                  <button
                    onClick={() => handleNav('/login')}
                    className="neu-btn w-full px-4 py-3 text-sm font-medium text-neu-text text-center"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleNav('/signup')}
                    className="neu-btn-accent w-full px-4 py-3 text-sm font-medium text-white text-center"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
