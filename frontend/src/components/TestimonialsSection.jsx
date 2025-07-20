import { useEffect, useRef, useState } from "react";
import { getTestimonials } from "../api/api";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error("❌ Error loading testimonials:", err.message);
      }
    };
    fetchData();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-br from-[#F5F7FA] to-[#EAF0F8] py-24 px-6">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <div className="flex justify-center mb-3">
          <Quote className="w-8 h-8 text-[#4A90E2]" />
        </div>
        <h2 className="text-4xl font-semibold text-[#2D2D2D]">
          What Students Say
        </h2>
        <p className="text-md text-gray-500 mt-2">
          Real stories from real travelers
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition mr-3"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-12 py-2 scrollbar-hide"
        >
          {testimonials.map(({ _id, name, rating, message }, index) => (
            <div
              key={_id + "-" + index}
              className="w-[280px] flex-shrink-0 bg-white/60 backdrop-blur-md border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
            >
              <h4 className="text-md font-semibold text-[#1E3A8A] mb-1 truncate">
                {name}
              </h4>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-5 break-words">
                {message}
              </p>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition ml-3"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </section>
  );
}
