import { MessageCircle } from "lucide-react";

export default function Chat() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2eafc]">
      <div className="bg-white/40 backdrop-blur-lg shadow-lg p-10 rounded-2xl text-center max-w-md w-full">
        <MessageCircle className="w-10 h-10 text-[#4A90E2] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">In-App Chat Coming Soon</h1>
        <p className="text-sm text-gray-600 mb-4">
          We're building an awesome chat feature so you can connect directly with your companions.
        </p>
        <span className="text-xs italic text-gray-500">Please wait... launching shortly.</span>
      </div>
    </div>
  );
}
