import Message from "../models/Message.js";
import Connection from "../models/Connection.js";

const rateLimits = new Map();

const activeUsers = new Map(); // userId → socket.id map

export const registerChatHandlers = (io, socket) => {
  console.log(`[socket] 🔌 New connection: ${socket.id}`);

  // Join user to connection-specific room
  socket.on("joinRoom", ({ connectionId, userId }) => {
    socket.join(connectionId);
    activeUsers.set(userId, socket.id);
    console.log(`[socket] 👥 User ${userId} joined room ${connectionId}`);
  });

  // Handle incoming message
  socket.on("sendMessage", async ({ connectionId, senderId, text }) => {
    try {
      const connection = await Connection.findById(connectionId);
      if (!connection)
        return console.log(`[error] ❌ Invalid connectionId: ${connectionId}`);

      // Prevent message if connection is not active
      await connection.populate(['tripId', 'matchedTripId']);

const isTripACompleted = connection.tripId?.status === 'completed';
const isTripBCompleted = connection.matchedTripId?.status === 'completed';

if (isTripACompleted || isTripBCompleted) {
  return socket.emit('errorMessage', 'Chat is disabled for completed trips.');
}


      // Rate limit logic can be added here (next step)
      // 🔒 Rate limiting
      const key = `${senderId}_${connectionId}`;
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute

      if (!rateLimits.has(key)) {
        rateLimits.set(key, []);
      }
      const timestamps = rateLimits.get(key);

      // Keep only timestamps in last 60 seconds
      const recent = timestamps.filter((ts) => now - ts < windowMs);
      recent.push(now);
      rateLimits.set(key, recent);

      if (recent.length > 8) {
        console.log(
          `[rate-limit] 🚫 ${senderId} exceeded message limit in ${connectionId}`
        );
        return socket.emit(
          "errorMessage",
          "Message limit reached. Please wait a moment."
        );
      }

      const newMessage = new Message({ connectionId, sender: senderId, text });
      await newMessage.save();

      io.to(connectionId).emit("receiveMessage", {
        _id: newMessage._id,
        connectionId,
        sender: senderId,
        text,
        createdAt: newMessage.createdAt,
      });

      console.log(
        `[chat] 💬 Message from ${senderId} in ${connectionId}: "${text}"`
      );
    } catch (err) {
      console.error("[socket] ⚠️ Error handling message:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`[socket] ❎ Disconnected: ${socket.id}`);
    for (const [userId, sId] of activeUsers.entries()) {
      if (sId === socket.id) activeUsers.delete(userId);
    }
  });
};
