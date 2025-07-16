import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import connectDB from './connections/db.js';
import authRouter from './routes/authRouter.js';
import tripRouter from './routes/tripRouter.js';
import connectionRouter from './routes/connectionRouter.js';
import testimonialRouter from './routes/testimonialRouter.js';


const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRouter);

// trip route
app.use('/api/trips', tripRouter);

// connection req route
app.use('/api/connections', connectionRouter);

// testimonials
app.use('/api/testimonials', testimonialRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
