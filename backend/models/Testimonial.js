import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
