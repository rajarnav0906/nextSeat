import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Route,
  Ticket,
  User,
  PlusCircle
} from "lucide-react";

export default function Sidebar({ collapsed, onToggle, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef();
  const user = JSON.parse(localStorage.getItem("user-info"));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <>
      {/* Mobile Sidebar */}
      {isMobile && mobileOpen && (
        <motion.aside
          ref={sidebarRef}
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-xl flex flex-col py-6 px-4"
        >
          <SidebarUser user={user} />
          <SidebarNav location={location} collapsed={false} onLinkClick={() => setMobileOpen(false)} user={user} />
        </motion.aside>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-screen bg-gradient-to-br from-white to-gray-100 shadow-xl z-40 flex flex-col justify-between py-6 px-2 rounded-r-2xl"
        >
          <div>
            <SidebarUser user={user} collapsed={collapsed} />
            <SidebarNav location={location} collapsed={collapsed} user={user} />
          </div>

          {/* Collapse Button */}
          <div className="flex justify-center mt-4">
            <button onClick={onToggle} className="text-[#4A90E2] hover:text-[#3A7AD9] transition cursor-pointer">
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </button>
          </div>
        </motion.aside>
      )}
    </>
  );
}

function SidebarUser({ user, collapsed }) {
  if (!user) return null;

  return (
    <div className={`text-center mb-4 px-2 transition-all duration-300 ${collapsed ? "hidden" : ""}`}>
      <div className="text-3xl mb-1">👤</div>
      <p className="font-semibold text-[#4A90E2] truncate">{user.name}</p>
      <p className="text-xs text-gray-600 truncate">{user.email}</p>
      <p className="text-xs text-gray-500">{user.branch || "Branch not set"}</p>
    </div>
  );
}

function SidebarNav({ location, collapsed, onLinkClick, user }) {
  const baseItems = [
    { to: "/", icon: <Home size={18} />, label: "Home" },
    { to: "/travel", icon: <Route size={18} />, label: "Travel Together" },
    { to: "/tickets", icon: <Ticket size={18} />, label: "Ticket Exchange" },
  ];

  // Protected Items
  const dashboardItem = {
    to: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 3v18h18V3H3zm3 3h3v3H6V6zm0 6h3v3H6v-3zm0 6h3v3H6v-3zm6-12h3v3h-3V6zm0 6h3v3h-3v-3zm0 6h3v3h-3v-3zm6-12h3v3h-3V6zm0 6h3v3h-3v-3z"></path>
      </svg>
    ),
    label: "Dashboard",
  };

  const addTripItem = {
    to: "/add-trip",
    icon: <PlusCircle size={18} />,
    label: "Add Trip"
  };

  // Check if user has completed profile (same logic for both dashboard and add trip)
  const hasCompletedProfile = user?.isVerified && 
                             user?.branch && 
                             user.branch !== "null" && 
                             user.branch !== "" && 
                             user?.declaredGender && 
                             user.declaredGender !== "null" && 
                             user.declaredGender !== "";

  return (
    <nav className="space-y-3 w-full mt-2 relative">
      {/* Base items (always visible) */}
      {baseItems.map(({ to, icon, label }) => (
        <SidebarItem
          key={to}
          to={to}
          icon={icon}
          label={label}
          collapsed={collapsed}
          active={location.pathname === to}
          onClick={onLinkClick}
        />
      ))}

      {/* Protected items (only visible with completed profile) */}
      {hasCompletedProfile && (
        <>
          <SidebarItem
            to={dashboardItem.to}
            icon={dashboardItem.icon}
            label={dashboardItem.label}
            collapsed={collapsed}
            active={location.pathname === dashboardItem.to}
            onClick={onLinkClick}
          />
          <SidebarItem
            to={addTripItem.to}
            icon={addTripItem.icon}
            label={addTripItem.label}
            collapsed={collapsed}
            active={location.pathname === addTripItem.to}
            onClick={onLinkClick}
          />
        </>
      )}

      {/* Auth items */}
      {!user ? (
        <SidebarItem
          to="/login"
          icon={<User size={18} />}
          label="Login / Signup"
          collapsed={collapsed}
          active={location.pathname === "/login"}
          onClick={onLinkClick}
        />
      ) : (
        <SidebarItem
          icon={<User size={18} />}
          label="Logout"
          collapsed={collapsed}
          redOutline
          onClick={() => {
            localStorage.removeItem("user-info");
            window.location.href = "/login";
          }}
        />
      )}
    </nav>
  );
}

function SidebarItem({ to, icon, label, collapsed, active, onClick, redOutline }) {
  const className = `
    group relative flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-150
    ${active ? "bg-[#4A90E2]/10 text-[#4A90E2]" : "text-gray-700 hover:bg-gray-200"}
    ${redOutline ? " text-red-500 hover:bg-red-100" : ""}
  `;

  const content = (
    <>
      <span className="text-xl">{icon}</span>
      <motion.span
        initial={false}
        animate={{
          opacity: collapsed ? 0 : 1,
          x: collapsed ? -10 : 0,
          maxWidth: collapsed ? 0 : 120,
        }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="overflow-hidden whitespace-nowrap ml-3"
      >
        {label}
      </motion.span>

      {/* Hover Tooltip */}
      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none whitespace-nowrap">
          {label}
        </div>
      )}
    </>
  );

  return to ? (
    <Link to={to} onClick={onClick} className={className + " cursor-pointer"}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={className + " w-full text-left cursor-pointer"}>
      {content}
    </button>
  );
}