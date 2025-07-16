import { useEffect, useState } from "react";
import { getTestimonials } from "../api/api";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

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

  const allTestimonials = [...testimonials, ...testimonials]; // for infinite effect

  return (
    <section className="bg-gradient-to-br from-[#F5F7FA] to-[#EAF0F8] py-20 px-6">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <div className="flex justify-center mb-2">
          <Quote className="w-8 h-8 text-[#4A90E2]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#2D2D2D]">
          What Students Say
        </h2>
        <p className="text-sm text-gray-500 mt-2">Real stories from real travelers</p>
      </div>

      {/* Slider Window */}
      <div className="relative overflow-hidden max-w-5xl mx-auto">
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {allTestimonials.map(({ _id, name, rating, message }, index) => (
            <div
              key={_id + "-" + index}
              className="min-w-[280px] max-w-[300px] bg-white/60 backdrop-blur-md border border-gray-100 p-5 rounded-2xl shadow hover:shadow-lg transition duration-300"
            >
              <h4 className="text-md font-semibold text-[#1E3A8A] mb-1">{name}</h4>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
