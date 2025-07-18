// backend/routes/authRouter.js
import { Router } from 'express';
import { googleLogin,manualLogin,signup, verifyEmail} from '../controllers/authController.js';
import idUploadRouter from './idUploadRouter.js';

const router = Router();

// Test route
router.get('/test', (req, res) => {
  res.send('Auth routes working');
});

// Google OAuth
router.post('/google', googleLogin);

// Manual Signup (with email verification)
router.post('/signup', signup);

// email verification link
router.get('/verify-email', verifyEmail);

// manual login
router.post('/login', manualLogin);

// id card upload
router.use('/upload-id', idUploadRouter);

export default router;
