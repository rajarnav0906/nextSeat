import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Check,
  X,
  User,
  MapPin,
  CalendarCheck,
  Bell,
  MessageSquare,
  Inbox,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = JSON.parse(localStorage.getItem("user-info"))?.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const reqRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/connections/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const unreadRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages/unread`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Normalize everything into one feed
        const reqFeed = reqRes.data.map((r) => ({
          id: r._id,
          type: "request",
          user: r.fromUser,
          trip: r.tripId,
        }));

        const msgFeed = Object.entries(unreadRes.data || {}).map(
          ([connectionId, data]) => ({
            id: connectionId,
            type: "message",
            count: data.count,
            trip: data.trip,
          })
        );

        setNotifications([...reqFeed, ...msgFeed]);
      } catch {
        toast.error("Failed to load notifications");
      }
    };

    fetchAll();
  }, [token]);

  const handleRespond = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/connections/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success(`Request ${status}`);
      navigate("/travel");
    } catch {
      toast.error("Failed to respond to request");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#EAF0F6]">
      {/* Header */}
      <div className="mb-8 text-center">
        <Bell className="w-10 h-10 text-[#4A90E2] mx-auto mb-2" />
        <h1 className="text-3xl font-extrabold text-[#2D2D2D]">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">
          All your alerts, requests, and messages in one place
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white/70 backdrop-blur rounded-2xl p-10 shadow-inner text-gray-500">
          <Inbox className="w-12 h-12 text-[#4A90E2] mb-3" />
          <p className="text-lg font-medium">You’re all caught up!</p>
          <p className="text-sm">No new notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-5 flex items-start justify-between gap-4 cursor-pointer"
              onClick={
                n.type === "message"
                  ? () => navigate(`/chat/${n.id}`)
                  : undefined
              }
            >
              {/* Left icon */}
              <div className="flex-shrink-0">
                {n.type === "request" ? (
                  <div className="w-10 h-10 rounded-full bg-[#E8F1FC] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#4A90E2]" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#E6F9F0] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                {n.type === "request" ? (
                  <>
                    <p className="font-medium text-[#2D2D2D]">
                      {n.user.name} ({n.user.declaredGender}) sent you a
                      connection request
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {n.trip.from} → {n.trip.to}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4 text-gray-400" />
                      {new Date(n.trip.date).toDateString()} @ {n.trip.time}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-[#2D2D2D]">
                      {n.count} new message{n.count > 1 ? "s" : ""} on your trip
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {n.trip.from} → {n.trip.to}
                    </p>
                  </>
                )}
              </div>

              {/* Right actions */}
              {n.type === "request" ? (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRespond(n.id, "accepted");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#E6F9F0] text-[#2E7D32] hover:bg-[#D2F0E4] text-sm font-medium"
                  >
                    <Check className="w-4 h-4 inline-block mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRespond(n.id, "rejected");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-[#C62828] hover:bg-red-100 text-sm font-medium"
                  >
                    <X className="w-4 h-4 inline-block mr-1" />
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-xs text-[#4A90E2] font-semibold">
                  Tap to open
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
