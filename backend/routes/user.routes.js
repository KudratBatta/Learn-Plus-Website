import express from 'express';
import { getMentors, getMentorById, getDashboardStats } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/mentors', getMentors);
router.get('/mentors/:id', getMentorById);
router.get('/dashboard/stats', protect, getDashboardStats);

export default router;
