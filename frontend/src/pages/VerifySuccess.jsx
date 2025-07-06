import { Link } from 'react-router-dom';

const VerifySuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Email Verified Successfully!</h1>
      <p className="text-gray-700 text-lg mb-6">
        Your account has been verified. You can now log in and start using the app.
      </p>
      <Link
        to="/login"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default VerifySuccess;
