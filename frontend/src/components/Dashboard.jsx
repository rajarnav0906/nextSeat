import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { getMyTrips } from "../api/api";
import { CalendarDays, Clock, PlusCircle } from "lucide-react";
import { useRefresh } from "../context/RefreshContext.jsx";


export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const user = JSON.parse(localStorage.getItem("user-info"));
  const sidebarWidth = collapsed ? 72 : 240;

  const { refreshFlag } = useRefresh();


  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

useEffect(() => {
  const fetchTrips = async () => {
    try {
      const data = await getMyTrips();
      setTrips(data);
      const allDates = [];

      for (const t of data) {
        if (t.date) {
          allDates.push({ date: new Date(t.date), label: `${t.from} → ${t.to}` });
        }

        if (t.legs && t.legs.length > 0) {
          t.legs.forEach((l) => {
            if (l.date) {
              allDates.push({ date: new Date(l.date), label: `${l.from} → ${l.to}` });
            }
          });
        }
      }

      setMarkedDates(allDates);
    } catch (err) {
      console.error("Failed to load trips:", err);
    }
  };

  fetchTrips();
}, [refreshFlag]); // 👈 reacts to changes


  const countStatus = (status) => trips.filter((t) => t.status === status).length;

const tileClassName = ({ date, view }) => {
  if (view === "month") {
    const d = date.toLocaleDateString('en-CA'); // 👈 Local YYYY-MM-DD
    return markedDates.some(md => md.date.toLocaleDateString('en-CA') === d)
      ? "highlight-tile"
      : null;
  }
};


const tileContent = ({ date, view }) => {
  if (view !== "month") return null;

  const d = date.toLocaleDateString('en-CA'); // 👈 Match format

  const matched = markedDates.find(md =>
    md.date.toLocaleDateString('en-CA') === d
  );

  if (matched) {
    const tooltipId = uuidv4();
    return (
      <>
        <div data-tip={matched.label} data-for={tooltipId}></div>
        <ReactTooltip id={tooltipId} effect="solid" place="top" />
      </>
    );
  }

  return null;
};


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

        <div className="p-6 sm:p-10 space-y-10">
          {/* Welcome */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#2D2D2D]">
              Welcome back, {user?.name || "User"}!
            </h2>
            <p className="text-sm text-gray-600">
              Branch: {user?.branch || "N/A"} | Email: {user?.email}
            </p>
          </section>

          {/* Stats + Calendar */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h3 className="text-3xl font-bold text-[#4A90E2]">{trips.length}</h3>
                <p className="text-gray-600 text-sm">Total Trips</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h3 className="text-3xl font-bold text-[#4A90E2]">{countStatus("active")}</h3>
                <p className="text-gray-600 text-sm">Active Trips</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h3 className="text-3xl font-bold text-[#4A90E2]">{countStatus("completed")}</h3>
                <p className="text-gray-600 text-sm">Completed Trips</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center gap-2 mb-3 text-[#2D2D2D]">
                <CalendarDays className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Upcoming Trips</h3>
              </div>
              <div className="calendar-container">
                <Calendar
                  className="w-full border-none"
                  tileClassName={tileClassName}
                  tileContent={tileContent}
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/travel" className="block bg-[#4A90E2] text-white p-6 rounded-xl shadow hover:bg-[#3A7AD9] transition">
              <h3 className="text-xl font-semibold mb-2">Travel Together</h3>
              <p className="text-sm">Join others on your route. Safer and cheaper.</p>
            </Link>
            <Link to="/tickets" className="block bg-[#50C878] text-white p-6 rounded-xl shadow hover:bg-[#45B06D] transition">
              <h3 className="text-xl font-semibold mb-2">Ticket Exchange</h3>
              <p className="text-sm">List unused tickets or grab one that matches your plan.</p>
            </Link>
          </section>

          {/* Recent Trips */}
          {/* Recent Trips */}
<section className="bg-white rounded-2xl shadow-lg p-6">
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-3 text-[#2D2D2D]">
      <Clock className="w-6 h-6 animate-pulse text-[#4A90E2]" />
      <h3 className="text-xl font-semibold">Your Recent Trips</h3>
    </div>
    <Link
      to="/add-trip"
      className="flex items-center gap-2 bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:bg-[#3a7bd5] transition text-sm font-medium"
    >
      <PlusCircle className="w-4 h-4" /> Add Trip
    </Link>
  </div>

  {trips.length === 0 ? (
    <div className="text-center text-gray-500 py-6 text-sm">
      <svg
        className="mx-auto w-12 h-12 text-[#4A90E2] mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2v-7H3v7a2 2 0 0 0 2 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      No recent trips yet. Start by creating one!
    </div>
  ) : (
    <ul className="space-y-4">
      {trips.slice(0, 3).map((trip) => (
        <li
          key={trip._id}
          className="flex items-start justify-between gap-4 border p-4 rounded-xl bg-gray-50 hover:shadow transition"
        >
          <div className="flex flex-col">
            <span className="text-[#2D2D2D] font-medium text-sm">
              {trip.from} → {trip.to}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(trip.date).toDateString()} at {trip.time}
            </span>
          </div>
          <span
            className={`ml-auto px-3 py-1 text-xs rounded-full capitalize font-medium ${
              trip.status === "active"
                ? "bg-[#E5F1FD] text-[#4A90E2]"
                : trip.status === "completed"
                ? "bg-[#E6F9F0] text-[#50C878]"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {trip.status}
          </span>
        </li>
      ))}
    </ul>
  )}
</section>

        </div>

        <Footer />
      </main>
    </div>
  );
}
