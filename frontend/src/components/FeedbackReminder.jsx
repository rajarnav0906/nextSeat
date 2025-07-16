import { useEffect, useState } from "react";
import { hasUserSubmitted } from "../api/api";
import { Link } from "react-router-dom";

export default function FeedbackReminder() {
  const [show, setShow] = useState(false);
  const user = JSON.parse(localStorage.getItem("user-info") || "{}");

  useEffect(() => {
    let timer;

    const check = async () => {
      if (!user._id || sessionStorage.getItem("feedback-dismissed") === "true") return;

      try {
        const submitted = await hasUserSubmitted(user._id);
        if (!submitted) {
          timer = setTimeout(() => {
            setShow(true);
          }, 1000); 
        }
      } catch (err) {
        console.error("❌ Failed to check testimonial:", err.message);
      }
    };

    check();

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("feedback-dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 w-72 border border-blue-100 z-50">
      <p className="text-sm text-gray-700 mb-2">
        We'd love your feedback! Share your experience and help us grow 💬
      </p>
      <div className="flex justify-end space-x-2">
        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={dismiss}
        >
          Dismiss
        </button>
        <Link
          to="/#testimonial-form"
          onClick={() => sessionStorage.setItem("feedback-dismissed", "true")}
          className="text-sm text-blue-600 font-medium"
        >
          Give Feedback
        </Link>
      </div>
    </div>
  );
}
