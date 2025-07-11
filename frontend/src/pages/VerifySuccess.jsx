import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const VerifySuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F0FFF4] text-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-lg w-full border border-green-200">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-3">Email Verified!</h1>
        <p className="text-[#4A4A4A] text-base mb-6">
          Your email has been successfully verified. You can now log in and explore the platform.
        </p>
        <Link
          to="/login"
          className="inline-block bg-[#4A90E2] hover:bg-[#3A7AD9] text-white px-6 py-3 rounded-full font-medium transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifySuccess;
