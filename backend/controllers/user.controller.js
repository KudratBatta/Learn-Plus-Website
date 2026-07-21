import User from '../models/User.js';

// @desc    Get all mentors
// @route   GET /api/users/mentors
// @access  Public
export const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name avatar bio skills expertise socialLinks createdCourses')
      .populate('createdCourses', 'title category');

    res.status(200).json({ success: true, count: mentors.length, mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get mentor detail profile
// @route   GET /api/users/mentors/:id
// @access  Public
export const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findOne({ _id: req.params.id, role: 'mentor' })
      .select('name avatar bio skills expertise socialLinks createdCourses')
      .populate('createdCourses', 'title category thumbnail level studentsCount averageRating');

    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    res.status(200).json({ success: true, mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student/mentor dashboard stats
// @route   GET /api/users/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'mentor') {
      const mentorId = req.user.id;

      // Find mentor's courses
      const courses = await User.findById(mentorId).populate('createdCourses');
      const createdCourses = courses ? courses.createdCourses : [];
      const courseIds = createdCourses.map(c => c._id);

      // Enrolled students in these courses
      const studentsList = await User.find({ enrolledCourses: { $in: courseIds } })
        .select('name email avatar createdAt');

      // totalStudents shown on UI should match the unique students list count.
      // (Avoid summing per-course enrolled counts, which can inflate numbers.)
      const totalEnrolled = studentsList.length;

      // Blogs created by mentor
      // (Blog controller author is `author` field)
      const Blog = (await import('../models/Blog.js')).default;
      const totalBlogs = await Blog.countDocuments({ author: mentorId, published: true });

      res.status(200).json({
        success: true,
        stats: {
          totalCourses: createdCourses.length,
          totalStudents: totalEnrolled,
          uniqueStudents: studentsList.length,
          totalBlogs,
          coursesList: createdCourses,
          studentsList,
        },
      });
    } else {
      // Student stats
      const studentId = req.user.id;
      const user = await User.findById(studentId)
        .populate('enrolledCourses')
        .populate('certificates');

      res.status(200).json({
        success: true,
        stats: {
          enrolledCount: user.enrolledCourses.length,
          certificatesCount: user.certificates.length,
          enrolledCourses: user.enrolledCourses,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
