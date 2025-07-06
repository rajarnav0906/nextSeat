import { Router } from 'express';
import { 
  googleLogin 
} from '../controllers/authController.js';

const router = Router();

// Test route
router.get('/test', (req, res) => {
    res.send('Auth routes working');
});

// Google OAuth
router.get('/google', googleLogin);





export default router;