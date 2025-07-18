import Message from "../models/Message.js";
import Connection from "../models/Connection.js";

const rateLimits = new Map();

const activeUsers = new Map(); 

export const registerChatHandlers = (io, socket) => {
  // console.log(`[socket]  New connection: ${socket.id}`);

  // Join user to connection-specific room
  socket.on("joinRoom", ({ connectionId, userId }) => {
    socket.join(connectionId);
    activeUsers.set(userId, socket.id);
    // console.log(`[socket]  User ${userId} joined room ${connectionId}`);
  });

  // Handle incoming message
  socket.on("sendMessage", async ({ connectionId, senderId, text }) => {
  try {
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      console.log(`[error] : Invalid connectionId: ${connectionId}`);
      return;
    }

    await connection.populate(['tripId', 'matchedTripId']);
    const isTripACompleted = connection.tripId?.status === 'completed';
    const isTripBCompleted = connection.matchedTripId?.status === 'completed';

    if (isTripACompleted || isTripBCompleted) {
      return socket.emit('errorMessage', 'Chat is disabled for completed trips.');
    }

    // Enforce 15 messages/day per connection
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messagesToday = await Message.countDocuments({
      sender: senderId,
      connectionId,
      createdAt: { $gte: today }
    });

    if (messagesToday >= 20) {
      // console.log(`[rate-limit] ${senderId} hit daily limit in ${connectionId}`);
      return socket.emit(
        "errorMessage",
        "Sorry but you've reached the 15 messages/day limit for this trip."
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

    // console.log(
    //   `[chat]  Message from ${senderId} in ${connectionId}: "${text}"`
    // );
  } catch (err) {
    console.error("[socket] : Error handling message:", err);
  }
});


  // Handle disconnect
  socket.on("disconnect", () => {
    // console.log(`[socket] : Disconnected: ${socket.id}`);
    for (const [userId, sId] of activeUsers.entries()) {
      if (sId === socket.id) activeUsers.delete(userId);
    }
  });
};
