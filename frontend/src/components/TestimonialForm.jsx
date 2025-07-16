import { useForm } from "react-hook-form";
import { postTestimonial, hasUserSubmitted } from "../api/api";
import { useState, useEffect } from "react";
import { Star, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function TestimonialForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState("");
  const [rating, setRating] = useState(0);
  const user = JSON.parse(localStorage.getItem("user-info") || "{}");

  useEffect(() => {
    const check = async () => {
      if (user._id) {
        try {
          const already = await hasUserSubmitted(user._id);
          setSubmitted(already);
        } catch (err) {
          console.error("❌ Error checking user testimonial:", err.message);
        }
      }
    };
    check();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, rating, userId: user._id, name: user.name };
      await postTestimonial(payload);
      setSuccess("✅ Thank you for your feedback!");
      setSubmitted(true);
      reset();
      setRating(0);
    } catch (err) {
      console.error("❌ Submission failed:", err.message);
    }
  };

  if (!user._id) {
    return (
      <div className="py-10 text-center text-gray-600">
        Please{" "}
        <Link to="/login" className="text-blue-500 underline">
          log in
        </Link>{" "}
        to submit a testimonial.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="py-10 text-center text-green-600 font-medium">
        You have already submitted a testimonial. Thank you!
      </div>
    );
  }

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-gradient-to-br from-[#F5F7FA] to-[#EAF0F8]">
      <div className="max-w-2xl mx-auto backdrop-blur-md bg-white/60 border border-gray-200 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-[#2D2D2D]">
          Share Your Experience
        </h2>

        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Star Rating Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Star Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    } transition`}
                  />
                </button>
              ))}
            </div>
            {rating === 0 && (
              <p className="text-red-500 text-sm mt-1">Please select a rating</p>
            )}
            <input type="hidden" value={rating} {...register("rating", { required: true })} />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              Message
            </label>
            <textarea
              {...register("message", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
              rows={4}
              placeholder="Share your travel experience..."
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">Message is required</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#4A90E2] hover:bg-[#3A7AD9] text-white font-semibold py-3 rounded-md shadow hover:shadow-lg transition"
          >
            Submit Testimonial
          </button>
        </form>
      </div>
    </section>
  );
}
