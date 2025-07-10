import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Route,
  Ticket,
  User,
  Menu,
  ChevronLeft,
} from "lucide-react";

export default function Sidebar({ collapsed, onToggle, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on outside click (mobile only)
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
          <button
            onClick={() => setMobileOpen(false)}
            className="self-end mb-6 text-[#4A90E2]"
          >
            <ChevronLeft size={20} />
          </button>
          <SidebarNav
            location={location}
            collapsed={false}
            onLinkClick={() => setMobileOpen(false)}
          />
        </motion.aside>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-screen bg-gradient-to-br from-white to-gray-100 shadow-xl z-40 flex flex-col py-6 px-2 rounded-r-2xl"
        >
          <button
            onClick={onToggle}
            className="text-[#4A90E2] mb-6 text-lg hover:text-[#3A7AD9] transition flex items-center justify-center w-10 h-10 rounded-full bg-white shadow self-center"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
          <SidebarNav location={location} collapsed={collapsed} />
        </motion.aside>
      )}
    </>
  );
}

function SidebarNav({ location, collapsed, onLinkClick }) {
  const items = [
    { to: "/", icon: <Home size={18} />, label: "Home" },
    { to: "/travel", icon: <Route size={18} />, label: "Travel Together" },
    { to: "/tickets", icon: <Ticket size={18} />, label: "Ticket Exchange" },
    { to: "/login", icon: <User size={18} />, label: "Login / Signup" },
  ];

  return (
    <nav className="space-y-4 w-full">
      {items.map(({ to, icon, label }) => (
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
    </nav>
  );
}

function SidebarItem({ to, icon, label, collapsed, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-150 ${
        active
          ? "bg-[#4A90E2]/10 text-[#4A90E2]"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
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
    </Link>
  );
}
