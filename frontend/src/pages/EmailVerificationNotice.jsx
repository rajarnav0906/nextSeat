const EmailVerificationNotice = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-yellow-50">
      <h1 className="text-2xl font-semibold text-yellow-700 mb-4">📧 Verify Your Email</h1>
      <p className="text-gray-700 text-center max-w-md">
        We’ve sent a verification link to your email. Please check your inbox and click the link to activate your account.
      </p>
    </div>
  );
};

export default EmailVerificationNotice;
