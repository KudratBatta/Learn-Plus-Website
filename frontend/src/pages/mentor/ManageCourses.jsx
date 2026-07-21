import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMentorCourses, deleteCourse } from '../../api/courses';
import { useToast } from '../../context/ToastContext';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await getMentorCourses();
      setCourses(res.courses || []);
    } catch (err) {
      console.error('Failed to fetch mentor courses:', err);
      error('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this course? All student progress logs will be lost.')) {
      return;
    }

    try {
      const res = await deleteCourse(id);
      if (res.success) {
        success('Course deleted successfully.');
        setCourses((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing courses directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Courses Studio</h1>
          <p className="text-slate-500 text-xs mt-1">
            Build or modify syllabus outlines, attach video configurations, and check enrollment stats.
          </p>
        </div>
        <Link
          to="/mentor/courses/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-lg shadow-sm transition text-center"
        >
          ➕ Create New Course
        </Link>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Enrolled</th>
                  <th className="px-6 py-4">Avg Rating</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-600 font-medium">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'}
                          alt={course.title}
                          className="w-12 aspect-video rounded object-cover bg-slate-50"
                        />
                        <span className="truncate max-w-[200px]">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{course.category}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">{course.totalEnrolled || 0} students</td>
                    <td className="px-6 py-4">★ {course.averageRating || '4.5'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-slate-500 hover:text-indigo-600 font-bold transition"
                        >
                          View
                        </Link>
                        <Link
                          to={`/mentor/courses/edit/${course._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-bold transition"
                        >
                          Edit Syllabus
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="text-rose-500 hover:text-rose-700 font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-4xl">🏜️</span>
            <h3 className="text-base font-bold text-slate-850 mt-3">No Courses Created</h3>
            <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto">
              You haven't created any courses yet. Click "Create New Course" above to add your first curriculum!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageCourses;
