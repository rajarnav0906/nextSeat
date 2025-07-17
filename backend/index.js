import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http'; // 👈 added
import { Server } from 'socket.io'; // 👈 added
import connectDB from './connections/db.js';

import authRouter from './routes/authRouter.js';
import tripRouter from './routes/tripRouter.js';
import connectionRouter from './routes/connectionRouter.js';
import testimonialRouter from './routes/testimonialRouter.js';
import messageRouter from './routes/messageRouter.js';

// cron + models
import cron from 'node-cron';
import Trip from './models/Trip.js';
import Connection from './models/Connection.js';

// 👇 Socket setup
import { registerChatHandlers } from './sockets/chatSocket.js';

const app = express();
const server = http.createServer(app); // 👈 create HTTP server for socket.io

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Register socket handlers
io.on('connection', (socket) => {
  registerChatHandlers(io, socket);
});

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRouter);
app.use('/api/trips', tripRouter);
app.use('/api/connections', connectionRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/messages', messageRouter);

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`[server] 🚀 Listening on port ${PORT}`);
});

// -------------------
// 🕛 CRON JOB (unchanged)
function getLatestDateTime(trip) {
  const times = [];

  if (trip?.date && trip?.time) {
    times.push(new Date(`${trip.date.toISOString().split('T')[0]}T${trip.time}`));
  }

  if (Array.isArray(trip.legs)) {
    for (const leg of trip.legs) {
      if (leg.date && leg.time) {
        times.push(new Date(`${leg.date.toISOString().split('T')[0]}T${leg.time}`));
      }
    }
  }

  return times.length > 0 ? new Date(Math.max(...times.map(t => t.getTime()))) : new Date(0);
}

cron.schedule('59 23 * * *', async () => {
  try {
    const now = new Date();
    console.log("🌙 [CRON] Running trip auto-completion check @", now.toISOString());

    const connections = await Connection.find({ status: 'accepted' })
      .populate('tripId')
      .populate('matchedTripId');

    for (const conn of connections) {
      const tripA = conn.tripId;
      const tripB = conn.matchedTripId;

      if (!tripA || !tripB) {
        console.warn("⚠️ Skipping connection with missing trip:", conn._id);
        continue;
      }

      const latest = new Date(Math.max(
        getLatestDateTime(tripA).getTime(),
        getLatestDateTime(tripB).getTime()
      ));

      if (now > latest) {
        await Trip.updateOne({ _id: tripA._id }, { status: 'completed' });
        await Trip.updateOne({ _id: tripB._id }, { status: 'completed' });
        await Connection.updateOne({ _id: conn._id }, { status: 'completed' });

        console.log(`✅ [AUTO COMPLETED] Trips ${tripA._id}, ${tripB._id} via connection ${conn._id}`);
      }
    }
  } catch (err) {
    console.error("❌ [CRON ERROR] Trip auto-completion failed:", err.message);
  }
});
