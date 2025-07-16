import { useState } from "react";
import { createTrip } from "../api/api";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  MapPin,
  UserCheck,
  Link as LinkIcon,
  PlusCircle,
  CheckCircle2,
  ChevronDown,
  X
} from "lucide-react";
import tripImage from "../../src/images/trip_add.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TripForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [genderPreference, setGenderPreference] = useState("any");
  const [hasConnections, setHasConnections] = useState(false);
  const [legs, setLegs] = useState([]);
  const navigate = useNavigate();


  const addLeg = () => {
    setLegs([...legs, { from: "", to: "", date: "", time: "" }]);
  };

  const updateLeg = (index, key, value) => {
    const updated = [...legs];
    updated[index][key] = value;
    setLegs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!from || !to || !date || !time) {
      toast.error("Please fill main trip details.");
      return;
    }

    if (hasConnections) {
      if (legs.length < 1) {
        toast.error("Please add at least one connection.");
        return;
      }
      for (let leg of legs) {
        if (!leg.from || !leg.to || !leg.date || !leg.time) {
          toast.error("Each leg must have all fields.");
          return;
        }
      }
    }

    try {
      const payload = {
        from, to, date, time, genderPreference,
        hasConnections,
        legs: hasConnections ? legs : []
      };

      await createTrip(payload);
      toast.success("Trip created!");
      setFrom(""); setTo(""); setDate(""); setTime("");
      setLegs([]); setHasConnections(false);
      navigate("/travel");
    } catch (err) {
      toast.error("Trip creation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-10 items-start">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow-lg p-6 sm:p-8 md:p-10 rounded-2xl w-full space-y-10"
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#2D2D2D] flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#4A90E2]" /> Plan Your Journey
            </h2>
            <p className="text-sm text-gray-600">
              Fill out your journey details below to create a new trip. You can optionally add connected train legs.
            </p>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-[#2D2D2D] mb-1">From</label>
              <input type="text" value={from} onChange={e => setFrom(e.target.value)} className="input px-4 py-3 text-[#2D2D2D]" placeholder="Origin station" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-[#2D2D2D] mb-1">To</label>
              <input type="text" value={to} onChange={e => setTo(e.target.value)} className="input px-4 py-3 text-[#2D2D2D]" placeholder="Destination station" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-[#2D2D2D] mb-1 flex items-center gap-1"><CalendarDays className="w-4 h-4 text-[#4A90E2]" /> Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input px-4 py-3 text-[#2D2D2D]" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-[#2D2D2D] mb-1 flex items-center gap-1"><Clock className="w-4 h-4 text-[#4A90E2]" /> Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input px-4 py-3 text-[#2D2D2D]" step="900" />
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="flex flex-col text-sm text-[#2D2D2D]">
              <span className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#4A90E2]" /> Gender Preference:
              </span>
              <div className="relative mt-1">
                <select
                  value={genderPreference}
                  onChange={e => setGenderPreference(e.target.value)}
                  className="appearance-none border p-3 pr-10 rounded w-full text-[#2D2D2D] focus:outline-none"
                >
                  <option value="any">Any</option>
                  <option value="only males">Only Males</option>
                  <option value="only females">Only Females</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              </div>
            </label>

            <label className="flex items-center gap-2 text-[#2D2D2D]">
              <CheckCircle2 className="w-5 h-5 text-[#4A90E2]" />
              <input type="checkbox" checked={hasConnections} onChange={e => setHasConnections(e.target.checked)} />
              <span className="text-sm">Include Connected Trains</span>
            </label>
          </div>

          {hasConnections && (
            <motion.div layout className="space-y-4">
              <h4 className="text-md font-medium text-[#2D2D2D] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#4A90E2]" /> Connected Legs
              </h4>
              {legs.map((leg, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: i * 0.1 }}
    className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200"
  >
    {/* ❌ Red 'X' Remove Button (inside box, top right) */}
    <button
      onClick={() => {
        const updated = [...legs];
        updated.splice(i, 1);
        setLegs(updated);
      }}
      type="button"
      title="Remove leg"
      className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition"
    >
      <X className="w-4 h-4" strokeWidth={2} />
    </button>

    <input type="text" placeholder="From" value={leg.from} onChange={e => updateLeg(i, "from", e.target.value)} className="input px-3 py-2 text-[#2D2D2D]" />
    <input type="text" placeholder="To" value={leg.to} onChange={e => updateLeg(i, "to", e.target.value)} className="input px-3 py-2 text-[#2D2D2D]" />
    <input type="date" value={leg.date} onChange={e => updateLeg(i, "date", e.target.value)} className="input px-3 py-2 text-[#2D2D2D]" />
    <input type="time" value={leg.time} onChange={e => updateLeg(i, "time", e.target.value)} className="input px-3 py-2 text-[#2D2D2D]" step="900" />
  </motion.div>
))}

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addLeg}
                className="flex items-center gap-1 bg-[#50C878] text-white px-4 py-2 rounded hover:bg-[#45B06D] transition"
              >
                <PlusCircle className="w-4 h-4" /> Add Connection
              </motion.button>
            </motion.div>
          )}

          <div className="text-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#4A90E2] text-white px-8 py-3 rounded hover:bg-[#3a7bd5] transition"
            >
              Submit Trip
            </motion.button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full hidden lg:flex justify-center"
        >
          <img src={tripImage} alt="Trip Visual" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md h-auto object-contain" />
        </motion.div>
      </div>
    </div>
  );
}
