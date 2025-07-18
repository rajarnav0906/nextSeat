import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// POST /api/testimonials
router.post('/', async (req, res) => {
  try {
    // console.log("Received testimonial submission:", req.body);
    const { userId, name, rating, message } = req.body;

    if (!userId || !name || !rating || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await Testimonial.findOne({ userId });
    if (existing) {
      return res.status(400).json({ error: 'You have already submitted a testimonial.' });
    }

    const newTestimonial = new Testimonial({ userId, name, rating, message });
    const saved = await newTestimonial.save();

    // console.log('Testimonial saved:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving testimonial:', err.message);
    res.status(500).json({ error: 'Failed to save testimonial' });
  }
});


// GET /api/testimonials
router.get('/', async (req, res) => {
  try {
    // console.log('Fetching testimonials with rating >= 3');
    const testimonials = await Testimonial.find({ rating: { $gte: 3 } }).sort({ createdAt: -1 });

    // console.log(`${testimonials.length} testimonials fetched`);
    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err.message);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({ userId: req.params.userId });
    res.json({ submitted: !!testimonial });
  } catch (err) {
    console.error("Error checking testimonial:", err.message);
    res.status(500).json({ error: "Error checking testimonial" });
  }
});


export default router;
