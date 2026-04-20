import express from 'express';
import { getProfile, updateProfile, analyzeResume } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/analyze-resume', protect, upload.single('resume'), analyzeResume);

export default router;
