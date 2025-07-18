import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { googleAuth, manualLogin } from '../api/api.js';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import loginIllustration from '../images/login.png';

const GoogleLoginPage = () => {
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

            {/* ✅ Google Login */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const idToken = credentialResponse?.credential;
                  if (!idToken) {
                    alert("Google login failed: No ID Token received");
                    return;
                  }

                  try {
                    const res = await googleAuth(idToken); // POST { idToken }
                    const { token, user } = res.data;
                    localStorage.setItem('user-info', JSON.stringify({ ...user, token }));
                    navigate('/dashboard');
                  } catch (err) {
                    console.error("Google login failed:", err.response?.data || err.message);
                    alert(err.response?.data?.message || "Google login error");
                  }
                }}
                onError={() => alert("Google login failed")}
                type="standard"
                theme="outline"
                size="large"
                shape="rectangular"
                width="100%"
              />
            </div>

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

export default GoogleLoginPage;
