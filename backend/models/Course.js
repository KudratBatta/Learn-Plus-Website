import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '10 mins' },
  videoUrl: { type: String, default: '' },     // kept optional, not displayed
  resourceUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  theoryContent: [{ type: String }],             // bullet-point theory slides
  order: { type: Number, default: 0 },
});

const syllabusWeekSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  lessons: [lessonSchema],
});

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: { type: String, unique: true },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: { type: String, default: '' },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'App Development',
        'Programming Languages',
        'Data Structures & Algorithms',
        'Machine Learning',
        'Artificial Intelligence',
        'Data Science',
        'Cybersecurity',
        'Cloud Computing',
        'DevOps',
        'UI/UX Design',
        'Database Management',
        'Aptitude & Interview Preparation',
        'Blockchain & Web3',
      ],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    language: { type: String, default: 'English' },
    duration: { type: String, default: '4 weeks' },
    totalLessons: { type: Number, default: 0 },
    tags: [{ type: String }],
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    syllabus: [syllabusWeekSchema],
    learningOutcomes: [{ type: String }],
    prerequisites: [{ type: String }],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalEnrolled: { type: Number, default: 0 },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    // Course-level crash course video (unique per course)
    crashCourse: {
      videoUrl: { type: String, default: '' },
      title: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Auto-generate slug
courseSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  // Calculate totalLessons
  this.totalLessons = this.syllabus.reduce((acc, week) => acc + week.lessons.length, 0);
  next();
});

export default mongoose.model('Course', courseSchema);
