import { Link } from 'react-router-dom';

const VerifyFailed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">❌ Verification Failed</h1>
      <p className="text-gray-700 text-lg mb-6">
        The verification link is invalid or has expired. Please try signing up again.
      </p>
      <Link
        to="/signup"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Back to Signup
      </Link>
    </div>
  );
};

export default VerifyFailed;
