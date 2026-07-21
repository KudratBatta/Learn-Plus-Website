import express from 'express';
import { generateCertificate, getCertificate, getMyCertificates } from '../controllers/certificate.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, generateCertificate);
router.get('/my/all', protect, getMyCertificates);
router.get('/:id', protect, getCertificate);

export default router;
