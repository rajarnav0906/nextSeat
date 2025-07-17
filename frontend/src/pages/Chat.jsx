import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import socket from "../utils/socket";
import { api } from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import { FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const Chat = ({ connectionId, currentUserId, isTripActive }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!connectionId || !currentUserId) return;

    setMessages([]);
    socket.emit("joinRoom", { connectionId, userId: currentUserId });

    api
      .get(`/messages/${connectionId}`)
      .then((res) => {
        setMessages(res.data);
        api.post(`/messages/mark-read/${connectionId}`).catch(console.warn);
      })
      .catch(() => setError("Failed to load messages."));

    const handleIncoming = (msg) => setMessages((prev) => [...prev, msg]);

    const handleError = (msg) => {
      if (msg.toLowerCase().includes("rate")) {
        toast.error("You're sending messages too fast. Please slow down.", {
          position: "top-center",
        });
      } else {
        setError(msg);
        setTimeout(() => setError(""), 3000);
      }
    };

    socket.on("receiveMessage", handleIncoming);
    socket.on("errorMessage", handleError);

    return () => {
      socket.off("receiveMessage", handleIncoming);
      socket.off("errorMessage", handleError);
    };
  }, [connectionId, currentUserId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !isTripActive) return;

    socket.emit("sendMessage", {
      connectionId,
      senderId: currentUserId,
      text: input.trim(),
    });

    setInput("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full h-[90vh] max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-4 md:p-6 flex flex-col">
      <ToastContainer />
      <h2 className="text-xl sm:text-2xl font-bold text-[#2D2D2D] mb-4">
        Travel Conversation
      </h2>

      <div className="flex-1 relative overflow-y-auto rounded-xl bg-gradient-to-br from-[#F5F7FA] via-white to-[#E0EAFD]">
        {/* Abstract blobs */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-[#4A90E2]/10 rounded-full blur-2xl z-0" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#50C878]/10 rounded-full blur-2xl z-0" />

        {/* Glass overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/40 rounded-xl z-10" />

        {/* Messages */}
        <div className="relative z-20 px-2 py-4 space-y-4 text-xs sm:text-sm md:text-base">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 8h2a2 2 0 012 2v7a2 2 0 01-2 2h-4l-4 4v-4H7a2 2 0 01-2-2v-1"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 3H5a2 2 0 00-2 2v10a2 2 0 002 2h2l3 3v-3h5a2 2 0 002-2V5a2 2 0 00-2-2z"
                />
              </svg>
              <p>No messages yet. Start the conversation.</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => {
                const senderId =
                  typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                const senderName =
                  typeof msg.sender === "object" ? msg.sender.name : "User";
                const isMine = senderId === currentUserId;

                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`w-full flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 ease-in-out ${
                        isMine
                          ? "bg-[#E6F9F0] text-[#2D2D2D] rounded-br-none"
                          : "bg-[#E5F1FD] text-[#2D2D2D] rounded-bl-none"
                      } text-xs sm:text-sm md:text-base`}
                    >
                      <div className="font-semibold mb-1">
                        {isMine ? "You" : senderName}
                      </div>
                      <div>{msg.text}</div>
                      <div className="text-[10px] sm:text-xs text-gray-400 mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          )}
        </div>
      </div>

      {!isTripActive && (
        <p className="text-xs text-red-500 mt-2">
          Trip is completed. Chat is read-only.
        </p>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <div className="flex items-center gap-3 mt-4">
        <textarea
          rows={1}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2] resize-none transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={!isTripActive}
        />
        <button
          onClick={sendMessage}
          disabled={!isTripActive}
          className={`p-3 rounded-full text-white text-sm transition flex items-center justify-center shadow-md ${
            isTripActive
              ? "bg-[#4A90E2] hover:bg-[#3A7AD9]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  connectionId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  isTripActive: PropTypes.bool.isRequired,
};

export default Chat;
