import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './connections/db.js';

import authRouter from './routes/authRouter.js';
import tripRouter from './routes/tripRouter.js';
import connectionRouter from './routes/connectionRouter.js';
import testimonialRouter from './routes/testimonialRouter.js';
import messageRouter from './routes/messageRouter.js';

import cron from 'node-cron';
import Trip from './models/Trip.js';
import Connection from './models/Connection.js';
import { registerChatHandlers } from './sockets/chatSocket.js';

// ---------------------------
// App + Socket.IO 
// ---------------------------
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  registerChatHandlers(io, socket);
});

const corsOptions = {
  origin: process.env.CLIENT_URL || 'https://saath-chaloge.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect DB
connectDB();

// ---------------------------
// Routes
// ---------------------------
app.use('/auth', authRouter);
app.use('/api/trips', tripRouter);
app.use('/api/connections', connectionRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/messages', messageRouter);

// ---------------------------
// Trip auto-complete logic
// ---------------------------
const TZ = 'Asia/Kolkata';

// yyyy-mm-dd for a Date in a given timezone
function ymdInTZ(d, tz) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(d).reduce((a, p) => (a[p.type] = p.value, a), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}


function combineDateTimeInTZ(dateObj, hhmm, tz) {
  if (!dateObj || !hhmm) return null;
  const [hh, mm] = hhmm.split(':').map(Number);
  const ymd = ymdInTZ(dateObj, tz);
  
  return new Date(`${ymd}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:00+05:30`);
}

function latestPlannedTime(trip, tz = TZ) {
  const candidates = [];
  if (trip?.date && trip?.time) {
    const dt = combineDateTimeInTZ(trip.date, trip.time, tz);
    if (dt) candidates.push(dt);
  }
  if (Array.isArray(trip?.legs)) {
    for (const leg of trip.legs) {
      if (leg?.date && leg?.time) {
        const dt = combineDateTimeInTZ(leg.date, leg.time, tz);
        if (dt) candidates.push(dt);
      }
    }
  }
  return candidates.length ? new Date(Math.max(...candidates.map(d => d.getTime()))) : null;
}

async function autoCompleteTripsNow() {
  const now = new Date();

  // 1) Connected trips
  const connections = await Connection.find({ status: 'accepted' })
    .populate('tripId')
    .populate('matchedTripId');

  for (const conn of connections) {
    const A = conn.tripId;
    const B = conn.matchedTripId;
    if (!A || !B) continue;

    const latest = new Date(Math.max(
      (latestPlannedTime(A) || new Date(0)).getTime(),
      (latestPlannedTime(B) || new Date(0)).getTime()
    ));

    if (latest && now > latest) {
      await Trip.updateOne({ _id: A._id }, { status: 'completed' });
      await Trip.updateOne({ _id: B._id }, { status: 'completed' });
      await Connection.updateOne({ _id: conn._id }, { status: 'completed' });
    }
  }

  // 2) Standalone trips (no accepted connections)
  const activeTrips = await Trip.find({ status: { $in: ['active', 'pending'] } });
  for (const t of activeTrips) {
    const latest = latestPlannedTime(t);
    if (latest && now > latest) {
      await Trip.updateOne({ _id: t._id }, { status: 'completed' });
    }
  }
}

// Protected endpoint for external cron (Render Cron Job)
app.post('/internal/cron/complete-trips', async (req, res) => {
  try {
    const key = req.header('X-CRON-KEY');
    if (!key || key !== process.env.CRON_SECRET) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    await autoCompleteTripsNow();
    return res.json({ ok: true });
  } catch (e) {
    console.error('[CRON API] error:', e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// ---------------------------
// Scheduled cron job to auto-complete trips daily at 2:53 PM IST
cron.schedule('7 15 * * *', async () => {
  try {
    await autoCompleteTripsNow();
  } catch (err) {
    console.error('[CRON ERROR]', err.message);
  }
}, { timezone: TZ });

// ---------------------------
// Start server
// ---------------------------
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
