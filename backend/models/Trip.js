import mongoose from 'mongoose';

const legSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  hasConnections: { type: Boolean, default: false },
  legs: [legSchema],
  date: { type: Date, required: true },
  time: { type: String, required: true },
  genderPreference: {
    type: String,
    enum: ['any', 'only males', 'only females'],
    default: 'any'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Trip', tripSchema);
