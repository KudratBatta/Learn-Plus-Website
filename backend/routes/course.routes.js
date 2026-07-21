import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  updateProgress,
  getCoursesByMentor,
  getEnrollmentsByMentor,
  rateCourse,
  getRecommendations,
  unenrollCourse,
  completeCourse,
} from '../controllers/course.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);

// Protected routes (Requires authentication)
router.get('/enrolled/me', protect, getEnrolledCourses);
router.get('/recommendations/me', protect, getRecommendations);

// Mentor specific routes
router.get('/mentor/me', protect, authorize('mentor', 'admin'), getCoursesByMentor);
router.get('/mentor/students', protect, authorize('mentor', 'admin'), getEnrollmentsByMentor);

router.get('/:id', protect, getCourseById);
router.post('/', protect, authorize('mentor', 'admin'), createCourse);
router.put('/:id', protect, authorize('mentor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteCourse);

// Enrollment & Progress & Ratings
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/unenroll', protect, unenrollCourse);
router.put('/:id/progress', protect, updateProgress);
router.post('/:id/rate', protect, rateCourse);


// Course completion (video ended)
router.post('/:id/complete', protect, completeCourse);


export default router;
