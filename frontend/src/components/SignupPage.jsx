import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth, manualSignup } from '../api/api.js';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: '',
    declaredGender: 'male',
    branch: 'CSE',
  });
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
      const message = err.response?.data?.message || 'Signup failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (authResult) => {
    try {
      if (authResult.code) {
        const response = await googleAuth(authResult.code);
        const { token, user } = response.data;
        localStorage.setItem('user-info', JSON.stringify({
          email: user.email,
          name: user.name,
          image: user.image,
          token
        }));
        navigate('/dashboard');
      }
    } catch {
      toast.error('Google signup failed. Please try again.');
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: handleGoogleSignup,
    onError: handleGoogleSignup,
    flow: 'auth-code'
  });

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1F2937]">Create your account</h2>
          <p className="text-[#6B7280] mt-1 text-sm">Join the community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiUser className="absolute top-3.5 left-3 text-[#9CA3AF]" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F2937] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              required
            />
          </div>

          <div className="relative">
            <FiMail className="absolute top-3.5 left-3 text-[#9CA3AF]" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F2937] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              required
            />
          </div>

          <div className="relative">
            <FiLock className="absolute top-3.5 left-3 text-[#9CA3AF]" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F2937] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              required
            />
          </div>

          <input
            type="text"
            name="collegeId"
            placeholder="College ID"
            value={formData.collegeId}
            onChange={handleChange}
            className="w-full py-2.5 px-4 bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F2937] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            required
          />

          <div className="flex items-center gap-6 text-sm text-[#374151]">
            <label className="flex items-center">
              <input
                type="radio"
                name="declaredGender"
                value="male"
                checked={formData.declaredGender === 'male'}
                onChange={handleChange}
                className="mr-2"
              /> Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="declaredGender"
                value="female"
                checked={formData.declaredGender === 'female'}
                onChange={handleChange}
                className="mr-2"
              /> Female
            </label>
          </div>

          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full py-2.5 px-4 bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F2937] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
            <option value="CE">Civil</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-lg transition"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-[#6B7280] my-4 text-sm">or</div>

        <button
          onClick={googleSignup}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#E5E7EB] rounded-lg bg-white hover:bg-[#F3F4F6] transition text-[#1F2937] font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34-4.3-50.2H272v95h146.9c-6.4 34.4-25.7 63.6-54.7 83.1v68h88.4c51.7-47.6 80.9-117.7 80.9-196.9z" />
            <path fill="#34A853" d="M272 544.3c73.6 0 135.3-24.4 180.3-66.3l-88.4-68c-24.5 16.4-55.7 26-91.9 26-70.7 0-130.6-47.8-152-111.9H28.1v70.5C72.8 480.7 165.4 544.3 272 544.3z" />
            <path fill="#FBBC05" d="M120 323.1c-10.5-31.4-10.5-65.2 0-96.6V156H28.1c-35.7 71.3-35.7 156.5 0 227.8l91.9-60.7z" />
            <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.6l77.9-77.9C407.3 24.1 345.6 0 272 0 165.4 0 72.8 63.6 28.1 156l91.9 70.5c21.4-64.1 81.3-111.9 152-111.9z" />
          </svg>
          Sign up with Google
        </button>

        <p className="text-sm text-center text-[#6B7280] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6366F1] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
