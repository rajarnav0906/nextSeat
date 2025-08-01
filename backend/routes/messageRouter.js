import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middlewares/authMiddleware.js";
import Connection from "../models/Connection.js";

const router = express.Router();

router.get("/unread", protect, async (req, res) => {
  const userId = req.user._id;

  try {
    const unread = await Message.aggregate([
      {
        $match: {
          read: false,
          sender: { $ne: userId },
          connectionId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$connectionId",
          count: { $sum: 1 },
        },
      },
    ]);

    const connectionIds = unread.map((item) => item._id);
    const connections = await Connection.find({
      _id: { $in: connectionIds },
      $or: [{ fromUser: userId }, { toUser: userId }],
    })

      .populate({
        path: "tripId",
        populate: { path: "user", select: "_id" },
      })
      .populate({
        path: "matchedTripId",
        populate: { path: "user", select: "_id" },
      });

    const unreadMap = {};

    unread.forEach((item) => {
      const conn = connections.find(
        (c) => c._id.toString() === item._id.toString()
      );
      if (!conn) return;

      const tripIdUserId =
        conn.tripId?.user?._id?.toString() || conn.tripId?.user?.toString();
      const matchedTripUserId =
        conn.matchedTripId?.user?._id?.toString() ||
        conn.matchedTripId?.user?.toString();

      const isOwnerOfTripA = tripIdUserId === userId.toString();
      const isOwnerOfTripB = matchedTripUserId === userId.toString();

      if (!isOwnerOfTripA && !isOwnerOfTripB) {
        return;
      }

      const trip = isOwnerOfTripA ? conn.tripId : conn.matchedTripId;

      unreadMap[item._id.toString()] = {
        count: item.count,
        trip: {
          from: trip?.from || "Unknown",
          to: trip?.to || "Unknown",
          date: trip?.date || null,
          time: trip?.time || null,
        },
      };
    });

    res.json(unreadMap);
  } catch (err) {
    console.error("[unread] Failed to enrich trips:", err.message);
    res.status(500).json({ error: "Failed to load unread messages" });
  }
});

router.get("/:connectionId", protect, async (req, res) => {
  const { connectionId } = req.params;
  const userId = req.user._id;

  try {
    const connection = await Connection.findById(connectionId);
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });

    const isParticipant =
      connection.fromUser.toString() === userId.toString() ||
      connection.toUser.toString() === userId.toString();

    if (!isParticipant) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this chat" });
    }

    const messages = await Message.find({ connectionId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email");

    res.json(messages);
  } catch (err) {
    console.error("[api] Failed to fetch messages:", err.message);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

router.post("/mark-read/:connectionId", protect, async (req, res) => {
  const { connectionId } = req.params;
  const userId = req.user._id;

  try {
    const result = await Message.updateMany(
      {
        connectionId,
        sender: { $ne: userId },
        read: false,
      },
      { $set: { read: true } }
    );

    // console.log(`Marked ${result.modifiedCount} messages as read for ${userId}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to mark messages as read:", err.message);
    res.status(500).json({ error: "Could not mark messages as read" });
  }
});

export default router;
