import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../Store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Appbar from '../Components/Appbar';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setLocalError('Password must contain uppercase, lowercase, and number.');
      return;
    }

    dispatch(signup({ username, email, password }));
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col">
      <Appbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-neu-bg px-4">
        <div className="neu-card w-full max-w-[420px] animate-neu-fade-in">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neu-accent mb-2 text-center">
            Create Account
          </h2>
          <p className="text-sm text-neu-text-muted text-center mb-6">
            Sign up to start creating events
          </p>

          {displayError && (
            <div className="neu-alert-error mb-4 text-center font-medium text-sm">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neu-text mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="neu-input w-full px-4 py-3 text-neu-text placeholder-neu-text-muted/60 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neu-text mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="neu-input w-full px-4 py-3 text-neu-text placeholder-neu-text-muted/60 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neu-text mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="neu-input w-full px-4 py-3 pr-10 text-neu-text placeholder-neu-text-muted/60 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neu-text-muted hover:text-neu-text"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neu-text mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="neu-input w-full px-4 py-3 text-neu-text placeholder-neu-text-muted/60 focus-visible:ring-2 focus-visible:ring-neu-accent/40 focus-visible:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neu-btn-accent w-full px-6 py-3 text-white font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-neu-text-muted text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-neu-accent font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
