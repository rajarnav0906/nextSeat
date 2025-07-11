import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth, manualLogin } from '../api/api.js';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import loginIllustration from '../images/login.png';

const GoogleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? 72 : 240;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await manualLogin({ email, password });
      const { token, user } = res.data;
      localStorage.setItem('user-info', JSON.stringify({ ...user, token }));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (authResult) => {
      if (authResult.code) {
        const res = await googleAuth(authResult.code);
        const { token, user } = res.data;
        localStorage.setItem('user-info', JSON.stringify({ ...user, token }));
        navigate('/dashboard');
      }
    },
    onError: () => alert('Google login failed'),
    flow: 'auth-code'
  });

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main
        className="transition-all duration-300 w-full"
        style={{
          marginLeft: isDesktop ? `${sidebarWidth}px` : "0px"
        }}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />


        <div className="flex flex-col-reverse lg:flex-row items-center justify-center min-h-[calc(100vh-80px)] px-6 py-10 gap-12">
          {/* Form */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-[#DDE6CC]">
            <h2 className="text-3xl font-bold text-[#2D2D2D] text-center mb-6">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiMail className="absolute top-3.5 left-3 text-[#4A90E2]" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#B9D4AA] bg-[#F9FAFB] text-[#2D2D2D] placeholder-gray-500 focus:ring-[#4A90E2] focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute top-3.5 left-3 text-[#4A90E2]" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#B9D4AA] bg-[#F9FAFB] text-[#2D2D2D] placeholder-gray-500 focus:ring-[#4A90E2] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A90E2] hover:bg-[#3A7AD9] text-white font-semibold rounded-md transition"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-gray-500 my-5 text-sm">or</div>

            <button
              onClick={googleLogin}
              className="w-full py-2.5 bg-white border border-[#CBD5C0] hover:bg-gray-100 text-[#2D2D2D] font-medium rounded-md flex items-center justify-center gap-2 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.3 8.4 3.5l6.2-6.2C34.8 2.7 29.7 0 24 0 14.9 0 7.2 5.6 3.5 13.5l7.2 5.6C12.4 13.4 17.8 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24.3c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.5 2.7-1.9 5.1-4 6.9l6.2 4.8c3.6-3.4 5.6-8.3 5.6-15.4z"/>
            <path fill="#FBBC05" d="M10.7 28.9c-1-2.6-1.6-5.3-1.6-8.2s.6-5.6 1.6-8.2l-7.2-5.6C1.3 12.2 0 17.9 0 24s1.3 11.8 3.5 16.1l7.2-5.6z"/>
            <path fill="#4285F4" d="M24 48c6.5 0 12-2.1 16.1-5.7l-6.2-4.8c-2.2 1.5-5 2.4-9.9 2.4-6.2 0-11.6-3.9-13.6-9.4l-7.2 5.6C7.2 42.4 14.9 48 24 48z"/>
          </svg>
              Sign in with Google
            </button>

            <p className="text-center text-sm mt-6 text-[#2D2D2D]">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-[#50C878] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Image */}
          <div className="max-w-md w-full flex justify-center">
            <img src={loginIllustration} alt="Login" className="w-full h-auto max-h-[400px]" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GoogleLogin;
