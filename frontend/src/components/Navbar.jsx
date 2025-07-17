import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo2.png';
import { Bell } from 'lucide-react';
import axios from 'axios';

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user-info");
    if (!userData) {
      // console.log("🔒 [Navbar] No user found — hiding bell");
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      const token = parsed?.token;
      if (!token) {
        // console.log("🔒 [Navbar] Token missing in user-info");
        return;
      }

      setIsLoggedIn(true);

      const fetchNotifications = async () => {
        try {
          const res = await axios.get("http://localhost:8080/api/connections/notifications", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPendingCount(res.data.length);
          // console.log(`🔔 [Navbar] Loaded ${res.data.length} pending requests`);
        } catch (err) {
          console.error("❌ [Navbar] Failed to fetch notifications:", err.response?.data || err.message);
        }
      };

      fetchNotifications();

      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    } catch (err) {
      console.error("❌ [Navbar] Failed to parse user-info:", err.message);
    }
  }, []);

  return (
    <div className="flex justify-between items-center bg-gray-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2 shadow-sm z-30 relative">
      <img
        src={logo}
        alt="TravelMate Logo"
        className="h-14 lg:h-[60px] w-auto cursor-pointer"
        onClick={() => navigate('/dashboard')}
      />

      <div className="flex items-center gap-4">
        {/* 🔔 Notification Bell (only if logged in) */}
        {isLoggedIn && (
          <div className="relative cursor-pointer" onClick={() => navigate('/notifications')}>
            <Bell className="w-6 h-6 text-[#4A90E2]" />
            {pendingCount > 0 && (
              <span className="absolute top-[-2px] right-[-2px] h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
        )}

        {/* ☰ Hamburger */}
        <button
          onClick={onMenuClick}
          className="block md:hidden text-[#4A90E2] p-2 focus:outline-none cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
