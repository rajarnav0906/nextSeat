import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import logo from "../images/logo2.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TestimonialsSection from "../components/TestimonialsSection";
import TestimonialForm from "../components/TestimonialForm";
import FeedbackReminder from "../components/FeedbackReminder";



const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export default function LandingPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);



  const navigate = useNavigate();

const handleExploreClick = () => {
  const userData = localStorage.getItem("user-info");

  if (!userData) {
    navigate("/login");
    return;
  }

  navigate("/travel");
};

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />
      <main
        className="transition-all duration-300 w-full"
        style={{
          marginLeft: isDesktop ? `${sidebarWidth}px` : "0px",
        }}
      >
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* HERO */}
        <section className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center px-6 sm:px-10 lg:px-20 gap-10 py-10 bg-gradient-to-r from-[#f0f4ff] to-white">
          <motion.div {...fade} className="lg:w-1/2 text-center lg:text-left mt-14 lg:mt-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-[#2D2D2D]">
              Travel Safer, Smarter, Together
            </h1>
            <p className="text-base sm:text-lg mb-6 max-w-md mx-auto lg:mx-0 text-gray-600">
              Connect with verified college students traveling the same route and time. Enjoy safe, cost-effective, and friendly journeys — powered by real identities and smart matchmaking.
            </p>
            <button
  onClick={handleExploreClick}
  className="bg-[#4A90E2] hover:bg-[#3A7AD9] text-white px-6 py-3 rounded-full transition shadow-md hover:shadow-lg"
>
  Explore It
</button>
          </motion.div>

          <motion.div {...fade} className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
            <DotLottieReact
              src="https://lottie.host/8a3d5037-15b2-481a-aac3-a1ebb6a352e2/VgaF2Sc3jh.lottie"
              className="w-full max-w-[600px] h-auto"
              loop
              autoplay
            />
          </motion.div>
        </section>

        {/* FEATURES */}
        <motion.section id="features" {...fade} className="py-24 px-6 sm:px-10 lg:px-20 bg-white">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-14">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              {
                title: "Verified Profiles",
                desc: "Each traveler is ID-verified, ensuring authenticity and safety."
              },
              {
                title: "Gender-Based Match",
                desc: "Choose to travel with female-only or mixed groups based on comfort."
              },
              {
                title: "Smart Matchmaking",
                desc: "Connect with others based on destination, time, and preferences."
              },
              {
                title: "Ticket Exchange",
                desc: "List and find unused tickets easily. No more wasted bookings!"
              }
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="bg-[#F5F7FA] p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#4A90E2]">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* STATS */}
        {/* <motion.section id="stats" {...fade} className="py-24 px-6 sm:px-10 lg:px-20 bg-[#F5F7FA]">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">Platform Highlights</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center">
            {[
              { value: "5K+", label: "Verified Users" },
              { value: "2K+", label: "Trips Matched" },
              { value: "1.2K", label: "Tickets Exchanged" },
              { value: "4.8/5", label: "User Rating" }
            ].map(({ value, label }) => (
              <div key={label}>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#4A90E2]">{value}</h3>
                <p className="text-sm mt-2 text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.section> */}

        {/* HOW IT WORKS */}
        <motion.section id="how-it-works" {...fade} className="py-24 px-6 sm:px-10 lg:px-20 bg-white">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {[
              {
                step: "1. Sign Up & Verify",
                desc: "Create an account and upload your student ID to get verified."
              },
              {
                step: "2. Find Companions",
                desc: "Choose destination, date, time, and filter your preferences."
              },
              {
                step: "3. Connect & Travel",
                desc: "Chat securely, finalize details, and travel together stress-free."
              }
            ].map(({ step, desc }) => (
              <div key={step} className="p-6 border-l-4 border-[#4A90E2] bg-[#F5F7FA] rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-2">{step}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>


           {/* Lottie Section */}
<section className="w-full bg-white px-4 sm:px-10 lg:px-20 py-16 flex items-center justify-center">
  <div className="w-full max-w-7xl">
    <DotLottieReact
      src="https://lottie.host/432eb287-f40d-45ef-a4cc-67d7e9163489/kOndD6vGnQ.lottie"
      loop
      autoplay
      className="w-full max-w-[600px] mx-auto"
    />
  </div>
</section>



        {/* WHY US */}
        <motion.section {...fade} className="py-24 px-6 sm:px-10 lg:px-20 bg-[#F5F7FA]">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">Why Choose saath chaloge?</h2>
          <ul className="max-w-4xl mx-auto text-base sm:text-lg list-disc list-inside space-y-4 text-gray-700">
            <li>Built exclusively for college students with ID verification.</li>
            <li>Empowers female travelers with safety-first group filtering.</li>
            <li>Integrated ticket marketplace to save unused journeys.</li>
            <li>Sleek, user-friendly interface with secure chat built-in.</li>
          </ul>
        </motion.section>



        {/* Lottie Section */}
{/* <section className="w-full bg-white py-16 px-4 sm:px-10 lg:px-20">
  <div className="max-w-7xl mx-auto">
    <DotLottieReact
      src="https://lottie.host/432eb287-f40d-45ef-a4cc-67d7e9163489/kOndD6vGnQ.lottie"
      loop
      autoplay
      className="w-full max-w-[900px] mx-auto"
    />
  </div>
</section> */}
<TestimonialsSection />
<section id="testimonial-form">
  <TestimonialForm />
</section>
<FeedbackReminder />
        <Footer />
      </main>
    </div>
  );
}
