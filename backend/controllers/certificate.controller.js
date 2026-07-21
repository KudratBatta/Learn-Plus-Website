import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';

// @desc    Generate / Claim a certificate for completed course
// @route   POST /api/certificates/generate
// @access  Private (Students only)
export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Please provide courseId' });
    }

    // Verify course completion (progress = 100)
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found for this course' });
    }

    if (enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: `Course not completed yet. Your progress is ${enrollment.progress}%`,
      });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({ student: req.user.id, course: courseId })
      .populate('student', 'name email')
      .populate('course', 'title duration level mentor')
      .populate({
        path: 'course',
        populate: { path: 'mentor', select: 'name' },
      });

    if (certificate) {
      return res.status(200).json({
        success: true,
        message: 'Certificate already generated',
        certificate,
      });
    }

    // Generate unique Certificate ID
    const uniqueId = `LP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    certificate = await Certificate.create({
      certificateId: uniqueId,
      student: req.user.id,
      course: courseId,
    });

    // Populate certificate details
    certificate = await Certificate.findById(certificate._id)
      .populate('student', 'name email')
      .populate('course', 'title duration level mentor')
      .populate({
        path: 'course',
        populate: { path: 'mentor', select: 'name' },
      });

    // Link certificate to User
    await User.findByIdAndUpdate(req.user.id, {
      $push: { certificates: certificate._id },
    });

    // Update enrollment status
    enrollment.certificateIssued = true;
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully! 🎉',
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
export const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('student', 'name email bio avatar')
      .populate('course', 'title duration level category mentor')
      .populate({
        path: 'course',
        populate: { path: 'mentor', select: 'name title signature avatar' },
      });

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.status(200).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all certificates of current user
// @route   GET /api/certificates/my/all
// @access  Private
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate('course', 'title category level duration thumbnail')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: certificates.length, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
