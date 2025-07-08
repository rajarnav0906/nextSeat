// backend/index.js

import dotenv from 'dotenv';
dotenv.config(); // Load env variables BEFORE anything else

import express from 'express';
import cors from 'cors';
import connectDB from './connections/db.js';
import authRouter from './routes/authRouter.js';
// import idUploadRouter from './routes/idUploadRouter.js'

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

// app.use('/upload-id', idUploadRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
