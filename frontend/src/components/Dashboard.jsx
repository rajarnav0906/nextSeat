import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { getMyTrips, getAcceptedConnections } from "../api/api";
import {
  CalendarDays,
  Clock,
  PlusCircle,
  User,
  Mail,
  Send,
  MessageCircle,
} from "lucide-react";
import FeedbackReminder from "../components/FeedbackReminder.jsx";

import { useRefresh } from "../context/RefreshContext.jsx";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [hovered, setHovered] = useState(null);

  // const hasSubmitted = await hasUserSubmitted(user._id);

  // const [selectedDay, setSelectedDay] = useState(today);

  // const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);

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
            allDates.push({
              date: new Date(t.date),
              label: `${t.from} → ${t.to}`,
            });
          }
          if (t.legs && t.legs.length > 0) {
            t.legs.forEach((l) => {
              if (l.date) {
                allDates.push({
                  date: new Date(l.date),
                  label: `${l.from} → ${l.to}`,
                });
              }
            });
          }
        }
        setMarkedDates(allDates);
      } catch (err) {
        console.error("Failed to load trips:", err);
      }
    };

    const fetchConnections = async () => {
      const data = await getAcceptedConnections();
      setCompanions(data.filter((conn) => conn.tripId && conn.matchedTripId));
    };

    fetchTrips();
    fetchConnections();
  }, [refreshFlag]);

  const countStatus = (status) =>
    trips.filter((t) => t.status === status).length;

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const d = date.toLocaleDateString("en-CA");
      return markedDates.some((md) => md.date.toLocaleDateString("en-CA") === d)
        ? "highlight-tile"
        : null;
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const d = date.toLocaleDateString("en-CA");
    const matched = markedDates.find(
      (md) => md.date.toLocaleDateString("en-CA") === d
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

  function formatBranch(branch = "") {
    return branch
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const filteredTrips = [...trips].sort((a, b) => {
    const dateA = new Date(
      `${new Date(a.date).toISOString().split("T")[0]}T${
        a.time.length === 5 ? a.time + ":00" : a.time
      }`
    );
    const dateB = new Date(
      `${new Date(b.date).toISOString().split("T")[0]}T${
        b.time.length === 5 ? b.time + ":00" : b.time
      }`
    );
    return dateB - dateA;
  });

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
                <h3 className="text-3xl font-bold text-[#4A90E2]">
                  {trips.length}
                </h3>
                <p className="text-gray-600 text-sm">Total Trips</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h3 className="text-3xl font-bold text-[#4A90E2]">
                  {countStatus("active")}
                </h3>
                <p className="text-gray-600 text-sm">Active Trips</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h3 className="text-3xl font-bold text-[#4A90E2]">
                  {countStatus("completed")}
                </h3>
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

          {/* Trip Actions */}
          {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/travel" className="block bg-[#4A90E2] text-white p-6 rounded-xl shadow hover:bg-[#3A7AD9] transition">
              <h3 className="text-xl font-semibold mb-2">Travel Together</h3>
              <p className="text-sm">Join others on your route. Safer and cheaper.</p>
            </Link>
            <Link to="/tickets" className="block bg-[#50C878] text-white p-6 rounded-xl shadow hover:bg-[#45B06D] transition">
              <h3 className="text-xl font-semibold mb-2">Ticket Exchange</h3>
              <p className="text-sm">List unused tickets or grab one that matches your plan.</p>
            </Link>
          </section> */}


          {/* Connected Companions */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-4">
              Connected Companions
            </h3>
            {companions.length === 0 ? (
              <p className="text-sm italic text-gray-500">
                You have no accepted companions yet.
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-500 italic mb-2">
                  Hover or tap on a connection to view their contact details.
                </p>
                <ul className="space-y-4">
                  {companions
                  .filter((conn) => conn.fromUser && conn.toUser)
                  .map((conn) => {
                    const isMeSender = conn.fromUser._id === user._id;
                    const otherUser = isMeSender ? conn.toUser : conn.fromUser;
                    const otherTrip = isMeSender
                      ? conn.matchedTripId
                      : conn.tripId;
                    if (!otherTrip) return null;

                    const isHovered = hovered === conn._id;

                    return (
                      <li
                        key={conn._id}
                        onMouseEnter={() => setHovered(conn._id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="text-sm space-y-1 relative">
                          <div className="font-semibold text-[#2D2D2D]">
                            {otherUser.name} ({otherUser.declaredGender})
                          </div>

                          {isHovered && (
                            <div className="absolute top-full left-0 mt-3 w-80 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-5 z-20 transition-all space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#e0e7ff] flex items-center justify-center text-[#4A90E2] shadow">
                                  <User className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col text-sm text-[#2D2D2D]">
                                  <div className="flex items-center gap-2 font-semibold">
                                    <User className="w-4 h-4" />
                                    <span>{otherUser.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>{otherUser.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <User className="w-4 h-4" />
                                    <span>
                                      Branch:{" "}
                                      {formatBranch(otherUser.branch) || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-xs text-gray-500">
                                You can coordinate further using the options
                                below.
                              </p>

                              <div className="flex justify-between gap-3">
                                <a
                                  href={`mailto:${otherUser.email}`}
                                  className="inline-flex items-center gap-2 text-sm bg-[#4A90E2] text-white px-4 py-2 rounded hover:bg-[#3A7AD9] transition cursor-pointer"
                                >
                                  <Send className="w-4 h-4" />
                                  Send Mail
                                </a>
                                <a
                                  href="/chat"
                                  className="inline-flex items-center gap-2 text-sm bg-[#50C878] text-white px-4 py-2 rounded hover:bg-[#3DB56B] transition cursor-pointer"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Chat
                                </a>
                              </div>
                            </div>
                          )}

                          <p className="text-gray-600">
                            Trip: {otherTrip.from} → {otherTrip.to}
                          </p>
                          <p className="text-gray-600">
                            Date: {new Date(otherTrip.date).toDateString()} @{" "}
                            {otherTrip.time}
                          </p>
                        </div>

                        <span className="mt-2 sm:mt-0 px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                          Connected
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>

          {/* Recent Trips Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-3 text-[#2D2D2D]">
                <Clock className="w-6 h-6 animate-pulse text-[#4A90E2]" />
                <h3 className="text-xl font-semibold">Your Trips</h3>
              </div>
            </div>

            {filteredTrips.length === 0 ? (
              <p className="text-center text-gray-500 py-6 text-sm">
                No trips match the selected view.
              </p>
            ) : (
              <ul className="space-y-4">
                {filteredTrips.map((trip) => (
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
        <FeedbackReminder />
        <Footer />
      </main>
    </div>
  );
}