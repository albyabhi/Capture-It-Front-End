import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, resetAuth } from '../Store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Calendar, ChevronDown } from 'lucide-react';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.auth);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(resetAuth());
    localStorage.removeItem('authToken');
    navigate('/');
    setOpen(false);
  };

  const initial = account?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 neu-btn px-3 py-2"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-neu-accent flex items-center justify-center text-white font-semibold text-sm">
          {initial}
        </div>
        <span className="text-sm font-medium text-neu-text hidden sm:inline truncate max-w-[100px]">
          {account?.username}
        </span>
        <ChevronDown
          size={14}
          className={`text-neu-text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-48 neu-raised-sm p-2 z-50 origin-top-right"
            role="menu"
          >
            <button
              onClick={() => { navigate('/profile'); setOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neu-text hover:bg-neu-surface-2 rounded-lg transition-colors"
              role="menuitem"
            >
              <User size={16} />
              Profile
            </button>
            <button
              onClick={() => { navigate('/profile?tab=events'); setOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neu-text hover:bg-neu-surface-2 rounded-lg transition-colors"
              role="menuitem"
            >
              <Calendar size={16} />
              My Events
            </button>
            <div className="neu-divider my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neu-error hover:bg-neu-surface-2 rounded-lg transition-colors"
              role="menuitem"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
