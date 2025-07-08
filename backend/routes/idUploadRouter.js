// backend/routes/idUploadRouter.js
import express from 'express';
import multer from 'multer';
import { extractDetails } from '../utils/extractDetails.js';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.fields([
  { name: 'frontImage', maxCount: 1 },
  { name: 'backImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.body;

    const frontBuffer = req.files.frontImage?.[0]?.buffer;
    const backBuffer = req.files.backImage?.[0]?.buffer;
    const frontMime = req.files.frontImage?.[0]?.mimetype;
    const backMime = req.files.backImage?.[0]?.mimetype;

    if (!frontBuffer || !backBuffer) {
      return res.status(400).json({ message: 'Both front and back images are required.' });
    }

    const frontExtract = await extractDetails(frontBuffer, frontMime);
    const backExtract = await extractDetails(backBuffer, backMime);

    const gender = frontExtract.gender || backExtract.gender;
    const branch = frontExtract.branch || backExtract.branch;

    if (!gender || !branch) {
      // Reset both fields to null if any is missing
      await User.findByIdAndUpdate(userId, {
        declaredGender: null,
        branch: null
      });

      return res.status(422).json({
        message: 'ID card is not clear. Please upload clearer images of both sides.'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      declaredGender: gender,
      branch
    }, { new: true });

    res.json({ message: 'Details updated successfully.', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process ID card', error: err.message });
  }
});

export default router;
