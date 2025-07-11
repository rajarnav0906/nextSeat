import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user-info"));
  const sidebarWidth = collapsed ? 72 : 240;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <main
        className="transition-all duration-300 w-full"
        style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : "0px" }}
      >
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="p-6 sm:p-10">
          {/* Greeting */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
              👋 Welcome back, {user?.name || "User"}!
            </h2>
            <p className="text-sm text-gray-600">
              Branch: {user?.branch || "N/A"} | Email: {user?.email}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Total Trips", value: "3" },
              { label: "Tickets Exchanged", value: "2" },
              { label: "Matches Found", value: "5" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow text-center">
                <h3 className="text-3xl font-bold text-[#4A90E2] mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Get Started Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link to="/travel" className="block bg-[#4A90E2] text-white p-6 rounded-xl shadow hover:bg-[#3A7AD9] transition">
              <h3 className="text-xl font-semibold mb-2">🚗 Travel Together</h3>
              <p className="text-sm">Join others on your route. Safer and cheaper.</p>
            </Link>
            <Link to="/tickets" className="block bg-[#50C878] text-white p-6 rounded-xl shadow hover:bg-[#45B06D] transition">
              <h3 className="text-xl font-semibold mb-2">🎫 Ticket Exchange</h3>
              <p className="text-sm">List unused tickets or grab one that matches your plan.</p>
            </Link>
          </div>

          {/* Recent Trips - Placeholder */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#2D2D2D]">🕒 Your Recent Trips</h3>
            <p className="text-gray-600 text-sm">No recent trips yet. Start by creating one!</p>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
