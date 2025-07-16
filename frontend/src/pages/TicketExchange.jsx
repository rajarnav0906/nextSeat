import { Ticket } from "lucide-react";

export default function TicketExchange() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2eafc]">
      <div className="bg-white/40 backdrop-blur-lg shadow-lg p-10 rounded-2xl text-center max-w-md w-full">
        <Ticket className="w-10 h-10 text-[#4A90E2] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Ticket Exchange Coming Soon</h1>
        <p className="text-sm text-gray-600 mb-4">
          Soon you'll be able to list unused tickets or find one that perfectly fits your journey.
        </p>
        <span className="text-xs italic text-gray-500">Stay tuned for updates.</span>
      </div>
    </div>
  );
}
