import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Check,
  X,
  User,
  MapPin,
  CalendarCheck,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const [requests, setRequests] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const token = JSON.parse(localStorage.getItem('user-info'))?.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const reqRes = await axios.get('http://localhost:8080/api/connections/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(reqRes.data);

        const unreadRes = await axios.get('http://localhost:8080/api/messages/unread', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const enriched = Object.entries(unreadRes.data || {}).map(([connectionId, data]) => ({
  connectionId,
  count: data.count,
  trip: data.trip
}));

        setUnreadMessages(enriched);
      } catch (err) {
        toast.error('Failed to load some notifications');
        console.warn('🔴 Notification fetch error:', err.message);
      }
    };

    fetchAllNotifications();
  }, [token]);

  const handleRespond = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/connections/${id}`, {
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(prev => prev.filter(r => r._id !== id));
      toast.success(`Request ${status}`);
      navigate('/travel');
    } catch (err) {
      toast.error("Failed to respond to request");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 text-[#2D2D2D]">
          <Bell className="w-6 h-6 text-[#4A90E2]" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Manage requests and chat alerts here.</p>
      </div>

      {/* Connection Requests */}
      {requests.length === 0 ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm italic mt-10">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          No pending connection requests.
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border p-5 flex flex-col sm:flex-row sm:items-center justify-between transition"
            >
              <div className="space-y-2 text-sm text-[#2D2D2D]">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#4A90E2]" />
                  <span className="font-medium">{r.fromUser.name}</span>
                  <span className="text-xs text-gray-500">({r.fromUser.declaredGender})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4A90E2]" />
                  {r.tripId.from} → {r.tripId.to}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-[#4A90E2]" />
                  {new Date(r.tripId.date).toDateString()} @ {r.tripId.time}
                </div>
              </div>

              <div className="flex gap-3 mt-4 sm:mt-0 sm:ml-6">
                <button
                  onClick={() => handleRespond(r._id, 'accepted')}
                  className="inline-flex items-center gap-2 bg-[#E6F9F0] hover:bg-[#D2F0E4] text-[#2E7D32] px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  <Check className="w-4 h-4" /> Accept
                </button>
                <button
                  onClick={() => handleRespond(r._id, 'rejected')}
                  className="inline-flex items-center gap-2 bg-[#FDEAEA] hover:bg-[#FAD4D4] text-[#C62828] px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unread Chat Messages */}
      {unreadMessages.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 text-[#2D2D2D] mb-3">
            <Bell className="w-5 h-5 text-[#4A90E2]" />
            <h2 className="text-xl font-semibold">Unread Chat Messages</h2>
          </div>
          <div className="space-y-4">
            {unreadMessages.map((msg) => (
              <div
                key={msg.connectionId}
                onClick={() => navigate(`/chat/${msg.connectionId}`)}
                className="cursor-pointer bg-white border rounded-xl p-4 hover:shadow transition text-sm flex justify-between items-center"
              >
                <div className="text-[#2D2D2D]">
                  <div className="font-medium">
                    💬 You have {msg.count} new message{msg.count > 1 ? 's' : ''} on trip:
                  </div>
                  <div className="text-gray-600">
                    {msg.trip.from} → {msg.trip.to}
                  </div>
                </div>
                <div className="text-xs text-blue-500 font-semibold underline">
                  Open Chat
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
