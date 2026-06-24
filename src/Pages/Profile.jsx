import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchMyEvents } from '../Store/authSlice';
import Appbar from '../Components/Appbar';
import { Calendar, ArrowRight, Eye } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { account, myEvents, eventsLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'events' ? 'events' : 'profile');

  useEffect(() => {
    if (account) {
      dispatch(fetchMyEvents());
    }
  }, [dispatch, account]);

  if (!account) return null;

  return (
    <div>
      <Appbar />
      <div className="min-h-screen bg-neu-bg px-4 py-8">
        <div className="max-w-[800px] mx-auto">
          {/* Profile Header */}
          <div className="neu-card mb-6 animate-neu-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-neu-accent flex items-center justify-center text-white text-2xl font-bold">
                {account.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-neu-text">{account.username}</h2>
                <p className="text-sm text-neu-text-muted">{account.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'neu-btn-accent text-white'
                  : 'neu-btn text-neu-text'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'events'
                  ? 'neu-btn-accent text-white'
                  : 'neu-btn text-neu-text'
              }`}
            >
              My Events ({myEvents.length})
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="neu-card animate-neu-fade-in">
              <h3 className="text-lg font-semibold text-neu-text mb-4">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neu-text-muted mb-1">Username</label>
                  <div className="neu-inset px-4 py-3 text-neu-text">{account.username}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neu-text-muted mb-1">Email</label>
                  <div className="neu-inset px-4 py-3 text-neu-text">{account.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neu-text-muted mb-1">Member Since</label>
                  <div className="neu-inset px-4 py-3 text-neu-text">
                    {new Date(account.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="animate-neu-fade-in">
              {eventsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="neu-spinner" />
                </div>
              ) : myEvents.length === 0 ? (
                <div className="neu-card text-center py-12">
                  <Calendar size={48} className="mx-auto text-neu-text-muted mb-4" />
                  <h3 className="text-lg font-medium text-neu-text mb-2">No events yet</h3>
                  <p className="text-sm text-neu-text-muted mb-4">
                    Create your first event to get started
                  </p>
                  <button
                    onClick={() => navigate('/create-room')}
                    className="neu-btn-accent px-6 py-2.5 text-white font-medium"
                  >
                    Create Event
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myEvents.map((room) => (
                    <div key={room._id} className="neu-card flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-neu-text truncate">{room.event_name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-neu-text-muted">
                          <span>Code: <span className="font-mono text-neu-accent">{room.room_code}</span></span>
                          <span>{new Date(room.created_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/event-room/${room.room_code}`)}
                          className="neu-icon-btn p-2.5"
                          title="View Event"
                        >
                          <Eye size={16} className="text-neu-accent" />
                        </button>
                        <button
                          onClick={() => navigate(`/user/${room.room_code}`)}
                          className="neu-icon-btn p-2.5"
                          title="Enter Room"
                        >
                          <ArrowRight size={16} className="text-neu-accent" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
