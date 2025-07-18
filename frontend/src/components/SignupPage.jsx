import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { googleAuth, manualSignup } from "../api/api.js";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await manualSignup(formData);
      toast.success("Verification link sent!");
      navigate("/verify-email-notice");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <main
        className="transition-all duration-300 w-full"
        style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : "0px" }}
      >
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="flex flex-col lg:flex-row justify-center items-center min-h-[calc(100vh-4rem)] px-6 sm:px-10 lg:px-20 gap-10 py-10">
          
          {/* Lottie animation */}
          <div className="w-full max-w-lg flex justify-center">
            <DotLottieReact
              src="https://lottie.host/9679afc1-208e-4746-9e62-a3dd8d839ff9/JSmB25jJKU.lottie"
              className="w-full max-w-[500px] h-auto"
              loop
              autoplay
            />
          </div>

          {/* Signup Form */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-[#E0E7F3]">
            <h2 className="text-3xl font-bold text-[#2D2D2D] text-center mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FiUser className="absolute top-3.5 left-3 text-[#4A90E2]" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 bg-[#F9FAFB] text-[#2D2D2D] focus:ring-[#4A90E2] focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <FiMail className="absolute top-3.5 left-3 text-[#4A90E2]" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 bg-[#F9FAFB] text-[#2D2D2D] focus:ring-[#4A90E2] focus:outline-none"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute top-3.5 left-3 text-[#4A90E2]" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 bg-[#F9FAFB] text-[#2D2D2D] focus:ring-[#4A90E2] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#4A90E2] hover:bg-[#3A7AD9] text-white font-semibold rounded-md transition"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center text-gray-500 my-4 text-sm">or</div>

            {/* ✅ Google Signup Button */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const idToken = credentialResponse?.credential;
                  if (!idToken) {
                    toast.error("Google signup failed: No ID token received");
                    return;
                  }

                  try {
                    const res = await googleAuth(idToken); // POST { idToken }
                    const { token, user } = res.data;
                    localStorage.setItem("user-info", JSON.stringify({ ...user, token }));
                    navigate("/dashboard");
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Google signup error");
                    console.error("Google signup failed:", err);
                  }
                }}
                onError={() => toast.error("Google signup failed")}
                type="standard"
                theme="outline"
                size="large"
                shape="rectangular"
                width="100%"
              />
            </div>

            <p className="text-center text-sm mt-6 text-[#2D2D2D]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#50C878] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
