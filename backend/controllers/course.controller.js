import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';


// @desc    Get all courses with search, filtering, and paging
// @route   GET /api/courses
// @access  Public (or protected if landing is public but browse is protected - prompt says Courses page requires login, so we'll check token. The landing page showcases preview. We will make this endpoint public but hide full details if needed, or protect it. The user said: "landing page should showcase featured courses... but the Courses and Blogs sections should only be accessible after a user or mentor logs in". So this API is protected or public but we guard pages in React. We will protect it, or let it be accessed with a protect middleware on frontend.)
export const getCourses = async (req, res) => {
  try {
    const { search, category, level, limit } = req.query;

    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    let queryBuilder = Course.find(query).populate('mentor', 'name avatar bio');

    if (limit) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }

    const courses = await queryBuilder.sort({ totalEnrolled: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private (Requires login)
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('mentor', 'name avatar bio socialLinks expertise')
      .populate('ratings.user', 'name avatar');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if current user is enrolled
    let enrollment = null;
    if (req.user) {
      enrollment = await Enrollment.findOne({ student: req.user.id, course: course._id });
    }

    res.status(200).json({ success: true, course, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Mentors only)
export const createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only mentors can create courses' });
    }

    const courseData = {
      ...req.body,
      mentor: req.user.id,
    };

    const course = await Course.create(courseData);

    // Add to mentor's created courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id },
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Course Owner / Mentors only)
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify course ownership
    if (course.mentor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Course Owner / Mentors only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify course ownership
    if (course.mentor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    // Remove course
    await Course.findByIdAndDelete(req.params.id);

    // Remove from mentor's createdCourses
    await User.findByIdAndUpdate(course.mentor, {
      $pull: { createdCourses: course._id },
    });

    // Remove all enrollments for this course
    await Enrollment.deleteMany({ course: course._id });

    // Remove from all students' enrolledCourses
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Students only)
export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    // Update course student count & list
    await Course.findByIdAndUpdate(courseId, {
      $push: { enrolledStudents: req.user.id },
      $inc: { totalEnrolled: 1 },
    });

    // Add course to user's enrolledCourses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: courseId },
    });

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's enrolled courses with progress
// @route   GET /api/courses/enrolled/me
// @access  Private
export const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        select: 'title description thumbnail category level duration totalLessons mentor syllabus',
        populate: { path: 'mentor', select: 'name avatar' },
      });

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course progress / complete a lesson
// @route   PUT /api/courses/:id/progress
// @access  Private
export const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    if (!lessonId) {
      return res.status(400).json({ success: false, message: 'Please provide lessonId' });
    }

    const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found for this course' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Toggle completed status: if already completed, un-complete it; otherwise, add it.
    const isCompleted = enrollment.completedLessons.some((l) => l.lessonId.toString() === lessonId);

    if (isCompleted) {
      enrollment.completedLessons = enrollment.completedLessons.filter((l) => l.lessonId.toString() !== lessonId);
    } else {
      enrollment.completedLessons.push({ lessonId });
    }

    // Calculate progress percentage
    const totalLessons = course.totalLessons || 1;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = Math.round((completedCount / totalLessons) * 100);
    enrollment.lastAccessedAt = new Date();

    if (enrollment.progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    } else if (enrollment.progress < 100) {
      enrollment.completedAt = null;
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      completedAt: enrollment.completedAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get courses created by a mentor
// @route   GET /api/courses/mentor/me
// @access  Private (Mentors only)
export const getCoursesByMentor = async (req, res) => {
  try {
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only mentors can access this route' });
    }

    const courses = await Course.find({ mentor: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students enrolled in a mentor's courses
// @route   GET /api/courses/mentor/students
// @access  Private (Mentors only)
export const getEnrollmentsByMentor = async (req, res) => {
  try {
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only mentors can access this route' });
    }

    // Get mentor's courses
    const mentorCourses = await Course.find({ mentor: req.user.id }).select('_id title');
    const courseIds = mentorCourses.map((c) => c._id);

    // Get enrollments
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name email avatar')
      .populate('course', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate and review a course
// @route   POST /api/courses/:id/rate
// @access  Private (Enrolled students only)
export const rateCourse = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide rating between 1 and 5' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify user is enrolled
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.id });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'You must be enrolled to rate this course' });
    }

    // Check if already rated, update or push
    const existingRatingIndex = course.ratings.findIndex((r) => r.user.toString() === req.user.id);

    if (existingRatingIndex > -1) {
      course.ratings[existingRatingIndex].rating = rating;
      course.ratings[existingRatingIndex].review = review || '';
      course.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      course.ratings.push({
        user: req.user.id,
        rating,
        review: review || '',
      });
    }

    // Calculate average rating
    const totalRating = course.ratings.reduce((sum, item) => sum + item.rating, 0);
    course.averageRating = Math.round((totalRating / course.ratings.length) * 10) / 10;

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      ratings: course.ratings,
      averageRating: course.averageRating,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Course completion (video ended)
// @route   POST /api/courses/:id/complete
// @access  Private
export const unenrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;


    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found for this course' });
    }

    // Remove enrollment
    await Enrollment.findByIdAndDelete(enrollment._id);

    // Decrement course counters and remove user from enrolledStudents list
    await Course.findByIdAndUpdate(courseId, {
      $pull: { enrolledStudents: req.user.id },
      $inc: { totalEnrolled: -1 },
    });

    // Remove course from user's enrolledCourses
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { enrolledCourses: courseId },
    });

    res.status(200).json({ success: true, message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Course completion (video ended)
// @route   POST /api/courses/:id/complete
// @access  Private
export const completeCourse = async (req, res) => {


  try {
    const { id: courseId } = req.params;

    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found for this course' });
    }

    // Mark completed
    enrollment.progress = 100;
    enrollment.completedAt = new Date();
    enrollment.certificateIssued = true;
    await enrollment.save();

    // If certificate already exists, return it
    let certificate = await Certificate.findOne({ student: req.user.id, course: courseId })
      .populate('student', 'name email')
      .populate('course', 'title duration level mentor');

    if (!certificate) {
      // Generate unique Certificate ID
      const uniqueId = `LP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      certificate = await Certificate.create({
        certificateId: uniqueId,
        student: req.user.id,
        course: courseId,
      });

      certificate = await Certificate.findById(certificate._id)
        .populate('student', 'name email')
        .populate('course', 'title duration level mentor')
        .populate({
          path: 'course',
          populate: { path: 'mentor', select: 'name' },
        });

      // Link certificate to User (idempotent: only push if user doesn't already have it)
      const student = await User.findById(req.user.id);
      const alreadyLinked = student.certificates.some((cid) => cid.toString() === certificate._id.toString());
      if (!alreadyLinked) {
        await User.findByIdAndUpdate(req.user.id, { $push: { certificates: certificate._id } });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Course completed successfully! 🎉',
      enrollment,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    // Look at user's enrolled course categories
    const enrollments = await Enrollment.find({ student: req.user.id }).populate('course', 'category');
    const categories = [...new Set(enrollments.map((e) => e.course?.category).filter(Boolean))];

    let recommended;

    if (categories.length > 0) {
      // Find other courses in similar categories that the user is NOT enrolled in
      const enrolledCourseIds = enrollments.map((e) => e.course?._id);
      recommended = await Course.find({
        category: { $in: categories },
        _id: { $nin: enrolledCourseIds },
        isPublished: true,
      })
        .populate('mentor', 'name avatar')
        .limit(6);

      // If we don't have enough category matches, backfill with top-rated/popular ones
      if (recommended.length < 4) {
        const extra = await Course.find({
          _id: { $nin: [...enrolledCourseIds, ...recommended.map((c) => c._id)] },
          isPublished: true,
        })
          .populate('mentor', 'name avatar')
          .sort({ averageRating: -1, totalEnrolled: -1 })
          .limit(6 - recommended.length);

        recommended = [...recommended, ...extra];
      }
    } else {
      // No courses enrolled yet, suggest popular/featured courses
      recommended = await Course.find({ isPublished: true })
        .populate('mentor', 'name avatar')
        .sort({ averageRating: -1, totalEnrolled: -1 })
        .limit(6);
    }

    res.status(200).json({ success: true, count: recommended.length, recommendations: recommended });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

