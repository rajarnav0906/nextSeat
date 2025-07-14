import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Check, X, User, MapPin, CalendarCheck } from 'lucide-react';

function Notifications() {
  const [requests, setRequests] = useState([]);
  const token = JSON.parse(localStorage.getItem('user-info'))?.token;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/connections/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
        console.log("📬 Notifications: Loaded", res.data.length, "pending requests");
      } catch (err) {
        console.error("❌ Failed to load requests:", err);
        toast.error("Failed to load notifications");
      }
    };

    fetchRequests();
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
      console.log(`✅ Request ${status}:`, res.data);
    } catch (err) {
      console.error("❌ Failed to respond:", err.response?.data || err.message);
      toast.error("Failed to respond to request");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F5F7FA]">
      <h1 className="text-2xl font-bold mb-6 text-[#2D2D2D]">Connection Requests</h1>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow-md border p-5 flex flex-col sm:flex-row sm:items-center justify-between"
            >
              <div className="space-y-2 text-sm text-[#2D2D2D]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4A90E2]" />
                  {r.fromUser.name} ({r.fromUser.declaredGender})
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#4A90E2]" />
                  {r.tripId.from} → {r.tripId.to}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#4A90E2]" />
                  {new Date(r.tripId.date).toDateString()} at {r.tripId.time}
                </div>
              </div>

              <div className="flex gap-3 mt-4 sm:mt-0 sm:ml-6">
                <button
                  onClick={() => handleRespond(r._id, 'accepted')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm rounded flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Accept
                </button>
                <button
                  onClick={() => handleRespond(r._id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
