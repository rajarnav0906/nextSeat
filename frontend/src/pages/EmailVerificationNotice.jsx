import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

const EmailVerificationNotice = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F7FA] text-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-lg w-full border border-blue-200">
        <MailCheck className="mx-auto text-[#4A90E2] mb-4" size={48} strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-3">Verify Your Email</h1>
        <p className="text-[#4A4A4A] text-base mb-4">
          We’ve sent a verification link to your email. Please check your inbox and click the link
          to activate your account.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Didn’t receive it? Check your spam folder or try signing up again.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-[#4A90E2] hover:bg-[#3A7AD9] text-white px-6 py-2.5 rounded-full font-medium transition"
        >
          Back to Signup
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
