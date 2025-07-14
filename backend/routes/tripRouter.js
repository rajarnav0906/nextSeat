import express from 'express';
import Trip from '../models/Trip.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Compare HH:MM strings with ±1 hour tolerance
function isTimeClose(time1, time2, marginMinutes = 60) {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  const t1 = h1 * 60 + m1;
  const t2 = h2 * 60 + m2;
  return Math.abs(t1 - t2) <= marginMinutes;
}

// Gender compatibility checker
function mutualGender(tripA, tripB) {
  const genderA = tripA.user.declaredGender?.toLowerCase();
  const genderB = tripB.user.declaredGender?.toLowerCase();

  const prefA = (tripA.genderPreference || "any").toLowerCase();
  const prefB = (tripB.genderPreference || "any").toLowerCase();

  const aAllowsB = prefA === "any" ||
                   (prefA === "only males" && genderB === "male") ||
                   (prefA === "only females" && genderB === "female");

  const bAllowsA = prefB === "any" ||
                   (prefB === "only males" && genderA === "male") ||
                   (prefB === "only females" && genderA === "female");

  const isMatch = aAllowsB && bAllowsA;

  console.log(`🧬 Gender Check:
  A: ${tripA.user.name} (${genderA}) prefers [${prefA}]
  B: ${tripB.user.name} (${genderB}) prefers [${prefB}]
  ✅ Mutual: ${isMatch}`);

  return isMatch;
}



// Create a new trip
router.post('/', protect, async (req, res) => {
  const { from, to, hasConnections, legs, date, time, genderPreference } = req.body;

  if (!from || !to || !date || !time) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  if (hasConnections) {
    if (!legs || !Array.isArray(legs) || legs.length === 0) {
      return res.status(400).json({ message: 'Legs must be provided for connected trips.' });
    }

    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];

    if (firstLeg.from.toLowerCase() !== from.toLowerCase()) {
      return res.status(400).json({ message: 'First leg "from" must match trip "from".' });
    }

    if (lastLeg.to.toLowerCase() !== to.toLowerCase()) {
      return res.status(400).json({ message: 'Last leg "to" must match trip "to".' });
    }

    for (const leg of legs) {
      if (!leg.from || !leg.to || !leg.date || !leg.time) {
        return res.status(400).json({ message: 'Each leg must have from, to, date, and time.' });
      }
    }
  }

  try {
    const trip = await Trip.create({
      user: req.user._id,
      from,
      to,
      hasConnections: !!hasConnections,
      legs: hasConnections ? legs : [],
      date,
      time,
      genderPreference
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Trip creation failed', error: err.message });
  }
});

// Get all trips (admin/dev only)
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find().populate('user', 'name declaredGender');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
});

// Get trips created by the logged-in user
router.get('/mine', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your trips' });
  }
});

// Update a trip
router.put('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (!trip.user.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Delete a trip
router.delete('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (!trip.user.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    await trip.remove();
    res.json({ message: 'Trip deleted' });
    
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Discover matching trips

router.get('/discover/:tripId', protect, async (req, res) => {
  try {
    const baseTrip = await Trip.findById(req.params.tripId).populate('user', 'name declaredGender genderPreference');
    if (!baseTrip) return res.status(404).json({ error: 'Trip not found' });

    const allTrips = await Trip.find({
      _id: { $ne: req.params.tripId },
      user: { $ne: req.user._id }
    }).populate('user', 'name declaredGender genderPreference');

    const toLegArray = (trip) => {
      if (trip.hasConnections && Array.isArray(trip.legs) && trip.legs.length > 0) {
        return trip.legs;
      } else {
        return [{
          from: trip.from,
          to: trip.to,
          date: trip.date,
          time: trip.time
        }];
      }
    };

    const isLegMatch = (legA, legB) =>
      legA.from.toLowerCase() === legB.from.toLowerCase() &&
      legA.to.toLowerCase() === legB.to.toLowerCase() &&
      new Date(legA.date).toISOString().slice(0, 10) === new Date(legB.date).toISOString().slice(0, 10) &&
      isTimeClose(legA.time, legB.time);

    const mutualGender = (tripA, tripB) => {
      const genderA = (tripA.user.declaredGender || '').toLowerCase();
      const genderB = (tripB.user.declaredGender || '').toLowerCase();

      const prefA = (tripA.genderPreference || 'any').toLowerCase();
      const prefB = (tripB.genderPreference || 'any').toLowerCase();

      const aAllowsB = prefA === 'any' ||
        (prefA === 'only males' && genderB === 'male') ||
        (prefA === 'only females' && genderB === 'female');

      const bAllowsA = prefB === 'any' ||
        (prefB === 'only males' && genderA === 'male') ||
        (prefB === 'only females' && genderA === 'female');

      return aAllowsB && bAllowsA;
    };

    const results = {};
    const baseLegs = toLegArray(baseTrip);

    console.log(`🧠 Base Trip: ${baseTrip._id} (${baseTrip.from} → ${baseTrip.to})`);
    console.log("👉 Base Legs:", baseLegs);

    for (const baseLeg of baseLegs) {
      const legKey = `${baseLeg.from} → ${baseLeg.to}`;
      results[legKey] = [];

      for (const otherTrip of allTrips) {
        if (!mutualGender(baseTrip, otherTrip)) continue;

        const otherLegs = toLegArray(otherTrip);

        // ✅ Case 1: Base leg matches any otherTrip's leg
        const directMatch = otherLegs.some(otherLeg => isLegMatch(baseLeg, otherLeg));

        // ✅ Case 2: Base leg matches otherTrip (direct)
        const reverseMatch = isLegMatch(baseLeg, {
          from: otherTrip.from,
          to: otherTrip.to,
          date: otherTrip.date,
          time: otherTrip.time
        });

        // ✅ Case 3: Base trip (if direct) matches any leg of otherTrip
        const reverseLegMatch = baseTrip.hasConnections
          ? false
          : otherLegs.some(leg => isLegMatch(leg, {
              from: baseTrip.from,
              to: baseTrip.to,
              date: baseTrip.date,
              time: baseTrip.time
            }));

        if (directMatch || reverseMatch || reverseLegMatch) {
          results[legKey].push(otherTrip);
        }
      }
    }

    console.log("🎯 Final Matches by Leg:", results);
    res.json(results);
  } catch (err) {
    console.error("❌ Discover Match Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});










export default router;