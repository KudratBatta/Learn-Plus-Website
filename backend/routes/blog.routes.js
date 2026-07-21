import express from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentBlog,
  deleteComment,
  getBlogsByMentor,
} from '../controllers/blog.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes (Blogs require authentication)
router.get('/', protect, getBlogs);
router.get('/mentor/me', protect, authorize('mentor', 'admin'), getBlogsByMentor);
router.get('/:id', protect, getBlogById);
router.post('/', protect, authorize('mentor', 'admin'), createBlog);
router.put('/:id', protect, authorize('mentor', 'admin'), updateBlog);
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteBlog);

// Likes & Comments
router.post('/:id/like', protect, likeBlog);
router.post('/:id/comment', protect, commentBlog);
router.delete('/:id/comment/:commentId', protect, deleteComment);

export default router;
