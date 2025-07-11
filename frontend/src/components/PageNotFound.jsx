import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-lg w-full border border-gray-200">
        <AlertTriangle className="mx-auto text-[#F59E0B] mb-4" size={48} strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-[#4A90E2] mb-2">404</h1>
        <p className="text-base text-gray-600 mb-6">
          Oops! The page you are looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#4A90E2] hover:bg-[#3A7AD9] text-white px-6 py-3 rounded-full font-medium transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
