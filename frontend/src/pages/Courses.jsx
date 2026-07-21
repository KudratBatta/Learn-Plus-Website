import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCourses, enrollInCourse, getMyEnrolledCourses, unenrollFromCourse } from '../api/courses';
import CourseCard from '../components/CourseCard';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { success, error } = useToast();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [enrollmentProgress, setEnrollmentProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Read category filter from route state (passed if coming from home categories)
  const [category, setCategory] = useState(location.state?.filterCategory || 'All');
  const [level, setLevel] = useState('All');

  const CATEGORIES = [
    'All',
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
  ];

  const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const loadData = async () => {
    setLoading(true);
    try {
      // Get all courses matches
      const res = await getCourses({
        search,
        category: category === 'All' ? undefined : category,
        level: level === 'All' ? undefined : level,
      });
      setCourses(res.courses || []);

      // If user is authenticated, get their enrollments to sync CTA button states
      if (isAuthenticated) {
        const enrolledRes = await getMyEnrolledCourses();
        const enrolledData = enrolledRes.enrollments || [];
        setEnrolledCourseIds(enrolledData.map((e) => e.course?._id));
        
        // Map progress
        const progMap = {};
        enrolledData.forEach((e) => {
          if (e.course) progMap[e.course._id] = e.progress;
        });
        setEnrollmentProgress(progMap);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      error('Failed to fetch courses catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, category, level, isAuthenticated]);

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      error('You must be signed in to enroll in courses');
      return;
    }

    try {
      const res = await enrollInCourse(courseId);
      if (res.success) {
        success('Successfully enrolled in course! 🎓');
        setEnrolledCourseIds((prev) => [...prev, courseId]);
        setEnrollmentProgress((prev) => ({ ...prev, [courseId]: 0 }));
        refreshUser();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Enrollment failed.');
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!isAuthenticated) {
      error('You must be signed in to undo enrollment.');
      return;
    }

    try {
      const res = await unenrollFromCourse(courseId);
      if (res.success) {
        success('Enrollment undone.');
        setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
        setEnrollmentProgress((prev) => {
          const next = { ...prev };
          delete next[courseId];
          return next;
        });
        refreshUser();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Undo failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header banner */}
      <div className="text-left mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Courses Catalog</h1>
        <p className="text-slate-500 text-sm mt-1.5 max-w-xl">
          Learn Plus is completely free. Search through 130+ modular curriculum logs, filter by levels, and start tracking your development timeline.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, skills, or tags..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Level Filters */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`text-xs font-bold px-4 py-2 rounded-md w-full md:w-auto transition ${
                level === lvl
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main categories & courses list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar categories filter */}
        <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-left text-xs font-bold px-3 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal transition-all ${
                  category === cat
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing catalog logs...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={enrolledCourseIds.includes(course._id)}
                  progress={enrollmentProgress[course._id] || 0}
                  onEnroll={user?.role === 'student' ? handleEnroll : undefined}
                  onUnenroll={user?.role === 'student' && enrolledCourseIds.includes(course._id) ? handleUnenroll : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-xl shadow-sm">
              <span className="text-4xl">📭</span>
              <h3 className="text-base font-bold text-slate-800 mt-4">No Courses Found</h3>
              <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto">
                No active courses match search criteria. Make sure to run the seed script locally to create 130+ entries in the database.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Courses;
