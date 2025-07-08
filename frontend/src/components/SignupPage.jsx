import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth, manualSignup } from '../api/api.js';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await manualSignup(formData);
      toast.success('Verification link sent!');
      navigate('/verify-email-notice');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (authResult) => {
      if (authResult.code) {
        const res = await googleAuth(authResult.code);
        const { token, user } = res.data;
        localStorage.setItem('user-info', JSON.stringify({ ...user, token }));
        navigate('/dashboard');
      }
    },
    onError: () => toast.error('Google signup failed'),
    flow: 'auth-code'
  });

  return (
    <div className="min-h-screen bg-[#FAFFCA] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-[#B9D4AA]">
        <h2 className="text-3xl font-bold text-[#2D2D2D] text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiUser className="absolute top-3.5 left-3 text-[#5A827E]" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#B9D4AA] bg-[#F9FAFB] text-[#2D2D2D] focus:ring-[#5A827E] focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <FiMail className="absolute top-3.5 left-3 text-[#5A827E]" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#B9D4AA] bg-[#F9FAFB] text-[#2D2D2D] focus:ring-[#5A827E] focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <FiLock className="absolute top-3.5 left-3 text-[#5A827E]" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#B9D4AA] bg-[#F9FAFB] text-[#2D2D2D] focus:ring-[#5A827E] focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#5A827E] hover:bg-[#84AE92] text-white font-semibold rounded-md transition"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-[#2D2D2D] my-4 text-sm">or</div>

        <button
          onClick={googleSignup}
          className="w-full py-2.5 bg-white border border-[#B9D4AA] hover:bg-[#F3F4F6] rounded-md text-[#2D2D2D] font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.3 8.4 3.5l6.2-6.2C34.8 2.7 29.7 0 24 0 14.9 0 7.2 5.6 3.5 13.5l7.2 5.6C12.4 13.4 17.8 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24.3c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.5 2.7-1.9 5.1-4 6.9l6.2 4.8c3.6-3.4 5.6-8.3 5.6-15.4z"/>
            <path fill="#FBBC05" d="M10.7 28.9c-1-2.6-1.6-5.3-1.6-8.2s.6-5.6 1.6-8.2l-7.2-5.6C1.3 12.2 0 17.9 0 24s1.3 11.8 3.5 16.1l7.2-5.6z"/>
            <path fill="#4285F4" d="M24 48c6.5 0 12-2.1 16.1-5.7l-6.2-4.8c-2.2 1.5-5 2.4-9.9 2.4-6.2 0-11.6-3.9-13.6-9.4l-7.2 5.6C7.2 42.4 14.9 48 24 48z"/>
          </svg>
          Sign up with Google
        </button>

        <p className="text-center text-sm mt-6 text-[#2D2D2D]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#5A827E] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
