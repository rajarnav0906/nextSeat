import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from './connections/db.js';
import authRouter from './routes/authRouter.js';

const app = express()

// Configure CORS properly
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // allows express to use JSON body parsing

dotenv.config({
  path: './.env'
});

const PORT = process.env.PORT || 8080;

// database configuration
connectDB();


app.use('/auth', authRouter);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})