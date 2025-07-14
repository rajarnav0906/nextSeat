import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyTrips, discoverMatches, deleteTrip } from "../api/api";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Clock,
  CalendarCheck,
  Search,
  Route,
  Trash2
} from "lucide-react";

export default function TravelPage() {
  const [trips, setTrips] = useState([]);
  const [matchResults, setMatchResults] = useState({});
  const [loadingTripId, setLoadingTripId] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await getMyTrips();
        const sorted = [...res].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTrips(sorted);
      } catch (err) {
        console.error("❌ Failed to load trips:", err);
        toast.error("Failed to load trips.");
      }
    };
    fetchTrips();
  }, []);

  const handleFindMatches = async (tripId) => {
    setLoadingTripId(tripId);
    try {
      const results = await discoverMatches(tripId);
      setMatchResults(prev => ({ ...prev, [tripId]: results }));
    } catch (err) {
      console.error("❌ Error finding matches:", err);
      toast.error("Failed to find matches.");
    } finally {
      setLoadingTripId(null);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!tripId) {
      toast.error("Trip ID missing.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this trip?");
    if (!confirm) return;

    try {
      const res = await deleteTrip(tripId);
      console.log("✅ Deleted Trip:", res);

      setTrips(prev => prev.filter(trip => trip?._id !== tripId));
      setMatchResults(prev => {
        const updated = { ...prev };
        delete updated[tripId];
        return updated;
      });

      toast.success("Trip deleted successfully!");
    } catch (err) {
      console.error("❌ Delete Trip Error:", err);
      toast.error("Failed to delete trip.");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#F5F7FA] min-h-screen">
      <h1 className="text-2xl font-bold text-[#2D2D2D] mb-6">Your Trips & Matches</h1>

      {Array.isArray(trips) && trips.length > 0 ? trips.map(trip => {
        const matches = matchResults[trip._id] || {};
        const { from, to, date, genderPreference, status, hasConnections, legs } = trip;
        const matchesFetched = trip._id in matchResults;

        return (
          <motion.div
            key={trip._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-6"
          >
            {/* Trip Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-sm text-[#2D2D2D]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4A90E2]" />
                  <span className="font-semibold">{from}</span>
                  <span className="mx-1">→</span>
                  <span className="font-semibold">{to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-[#4A90E2]" />
                  {new Date(date).toDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#4A90E2]" />
                  Preference: {genderPreference}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4A90E2]" />
                  Status: <span className="capitalize">{status}</span>
                </div>
              </div>

              {hasConnections && legs?.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl border border-[#4A90E2] space-y-3 text-sm">
                  <p className="font-semibold text-[#4A90E2] flex items-center gap-2">
                    <Route className="w-4 h-4" /> Connected Legs
                  </p>
                  {legs.map((leg, i) => (
                    <div key={i} className="pl-3 border-l-2 border-dashed border-gray-300 ml-1">
                      <p className="font-medium">{leg.from} → {leg.to}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(leg.date).toDateString()} @ {leg.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleFindMatches(trip._id)}
                disabled={loadingTripId === trip._id}
                className="bg-[#4A90E2] text-white text-sm px-6 py-2 rounded-md hover:bg-[#3a7bd5] transition flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loadingTripId === trip._id ? "Finding..." : "Find Companions"}
              </button>

              <button
                onClick={() => handleDeleteTrip(trip._id)}
                className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
                title="Delete Trip"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>

            {/* Match Section */}
            {matchesFetched && (
              <div className="border-t border-gray-200 pt-6 space-y-6">
                {Object.entries(matches).map(([key, trips]) => (
                  <div key={key}>
                    <h3 className="text-md font-semibold text-[#4A90E2] flex items-center gap-2 mb-3">
                      <Route className="w-5 h-5" /> Matches for {hasConnections ? `Leg: ${key}` : `Trip: ${key}`}
                    </h3>

                    {trips.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {trips.map((t) => (
                          <div
                            key={t._id}
                            className="bg-white border p-4 rounded-xl shadow-sm text-sm hover:shadow-md transition"
                          >
                            <p className="font-semibold text-[#2D2D2D]">{t.user.name}</p>
                            <p className="text-gray-600">From: {t.from}</p>
                            <p className="text-gray-600">To: {t.to}</p>
                            <p className="text-gray-600">Date: {new Date(t.date).toDateString()}</p>
                            <p className="text-gray-600">Time: {t.time}</p>
                            <p className="text-gray-600">Gender: {t.user.declaredGender}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-500 pl-1">No one found for this leg ({key}).</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      }) : (
        <p className="text-gray-500 text-sm italic">No trips found.</p>
      )}
    </div>
  );
}
