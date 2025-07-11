import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const VerifyFailed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-red-50 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-lg w-full border border-red-300">
        <XCircle className="mx-auto text-red-600 mb-4" size={48} strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-red-700 mb-3">Verification Failed</h1>
        <p className="text-gray-700 text-base mb-6">
          The verification link is either invalid or has expired. Please try signing up again.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition"
        >
          Back to Signup
        </Link>
      </div>
    </div>
  );
};

export default VerifyFailed;
