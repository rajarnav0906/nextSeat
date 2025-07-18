import express from 'express';
import Connection from '../models/Connection.js';
import Trip from '../models/Trip.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Send connection request
 * Body: { tripId, matchedTripId }
 */
router.post('/', protect, async (req, res) => {
  try {
    const { tripId, matchedTripId } = req.body;
    const fromUser = req.user._id;

    const trip = await Trip.findById(tripId);
    const matchedTrip = await Trip.findById(matchedTripId);

    if (!trip || !matchedTrip) {
      // console.log(" One or both trips not found");
      return res.status(404).json({ message: 'Trip not found' });
    }

    const toUser = matchedTrip.user;

    if (fromUser.toString() === toUser.toString()) {
      return res.status(400).json({ message: "You can't connect to your own trip" });
    }

    const existing = await Connection.findOne({
      tripId,
      matchedTripId
    });

    if (existing) {
      if (existing.status === 'rejected') {
        return res.status(403).json({ message: 'This request was previously rejected' });
      }
      return res.status(409).json({ message: 'Connection request already exists' });
    }

    const connection = await Connection.create({
      tripId,
      matchedTripId,
      fromUser,
      toUser,
      status: 'pending'
    });

    // console.log("Connection request sent:", connection._id);
    res.status(201).json(connection);

  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get pending requests where current user is receiver
 */
router.get('/notifications', protect, async (req, res) => {
  try {
    const requests = await Connection.find({
      toUser: req.user._id,
      status: 'pending'
    })
      .populate('fromUser', 'name declaredGender')
      .populate('tripId')
      .populate('matchedTripId');

    // console.log(`${requests.length} pending requests for user ${req.user._id}`);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * Get all connection records involving the user
 * (used for checking connect status in TravelPage)
 */
router.get('/mine', protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    }).select('tripId matchedTripId status fromUser toUser');

    // console.log(`[GET /connections/mine] ${connections.length} connections for user ${req.user._id}`);
    res.json(connections.map(c => ({
      tripId: c.tripId.toString(),
      matchedTripId: c.matchedTripId.toString(),
      status: c.status,
      fromUser: c.fromUser.toString(),
      toUser: c.toUser.toString()
    })));
  } catch (err) {
    console.error("Error in /connections/mine:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * Accept or Reject a connection
 * Body: { status: 'accepted' | 'rejected' }
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    if (connection.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to act on this request' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    connection.status = status;
await connection.save();

//  Mark both trips as active if accepted
if (status === 'accepted') {
  await Trip.updateOne({ _id: connection.tripId }, { status: 'active' });
  await Trip.updateOne({ _id: connection.matchedTripId }, { status: 'active' });
  // console.log(`Marked trips ${connection.tripId} and ${connection.matchedTripId} as active`);
}


    // console.log(`Connection ${status}:`, connection._id);
    res.json({ message: `Connection ${status}` });

  } catch (err) {
    console.error("Error updating connection:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * Get accepted connections for the logged-in user
 */
router.get('/accepted', protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ],
      status: 'accepted'
    })
      .populate('tripId')
      .populate('matchedTripId')
      .populate('fromUser', 'name declaredGender email branch')
      .populate('toUser', 'name declaredGender email branch');

    //  Filter out connections with missing user
    const validConnections = connections.filter(conn => conn.fromUser && conn.toUser);
    const skipped = connections.length - validConnections.length;

    // if (skipped > 0) {
    //   console.warn(`Skipped ${skipped} broken connections for user ${req.user._id}`);
    // }

    // console.log(`[GET /connections/accepted] ${validConnections.length} found for ${req.user._id}`);
    res.json(validConnections);
  } catch (err) {
    console.error("Error fetching accepted companions:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// // GET /connections/:id/status → Returns { isTripActive: true/false }

// router.get('/:id', protect, async (req, res) => {
//   try {
//     const connectionId = req.params.id;
//     const connection = await Connection.findById(connectionId);

//     if (!connection) {
//       return res.status(404).json({ error: 'Connection not found' });
//     }

//     const userId = req.user._id.toString();
//     const tripAUser = connection.fromUser?.toString();
//     const tripBUser = connection.toUser?.toString();

//     let tripIdToCheck;

//     if (tripAUser === userId) {
//       tripIdToCheck = connection.tripId;
//     } else if (tripBUser === userId) {
//       tripIdToCheck = connection.matchedTripId;
//     } else {
//       return res.status(403).json({ error: 'Unauthorized access to this connection' });
//     }

//     const trip = await Trip.findById(tripIdToCheck);
//     const tripStatus = trip?.status || 'unknown';

//     res.status(200).json({
//       isTripActive: tripStatus === 'active',
//       tripStatus,
//       userTripId: tripIdToCheck,
//       peerTripId: tripIdToCheck.equals(connection.tripId)
//         ? connection.matchedTripId
//         : connection.tripId,
//       peerUserId: tripIdToCheck.equals(connection.tripId)
//         ? connection.toUser
//         : connection.fromUser,
//     });
//   } catch (err) {
//     console.error(' Error fetching connection by ID:', err);
//     res.status(500).json({ error: 'Failed to fetch connection.' });
//   }
// });








export default router;