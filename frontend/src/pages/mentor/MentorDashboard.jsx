import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { getDashboardStats } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const MentorDashboard = () => {
  const { user } = useAuth();
  const { error } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.stats);
      } catch (err) {
        console.error('Failed to load mentor dashboard stats:', err);
        error('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    // Refresh whenever we come back to mentor dashboard
    // (e.g., after publishing a blog).
    fetchStats();
  }, [location.pathname]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing mentor analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Mentor Workspace</h1>
          <p className="text-slate-500 text-xs mt-1">
            Welcome, <strong className="text-slate-700">{user?.name}</strong>! Review enrollment trends, draft curriculum changes, or publish blog updates.
          </p>
        </div>
        <Link
          to="/mentor/profile"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 transition text-center"
        >
          Mentor Profile
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-xl text-indigo-600">
            🎓
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850">{stats?.uniqueStudents || 0}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Enrolled Students</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-xl text-emerald-600">
            📁
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850">{stats?.totalCourses || 0}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Created Courses</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-cyan-50 rounded-xl flex items-center justify-center text-xl text-cyan-600">
            📝
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850">{stats?.totalBlogs || 0}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Blogs Created</p>
          </div>
        </div>

      </div>

      {/* Navigation shortcuts / Workspace hubs */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Workspace Hubs</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Course CRUD hub */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <span className="text-2xl">🎓</span>
            <h4 className="font-bold text-slate-800 text-sm mt-3">Manage Courses</h4>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Create and edit course curriculum syllabi. Upload instructional video attachments and handouts. Delete outdated catalogs.
            </p>
          </div>
          <Link
            to="/mentor/courses"
            className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg text-center mt-6 transition shadow"
          >
            Launch Courses Studio
          </Link>
        </div>

        {/* Blogs CRUD hub */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <span className="text-2xl">✍️</span>
            <h4 className="font-bold text-slate-800 text-sm mt-3">Write Blogs</h4>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Compose engineering guides and articles. Write about cloud models, typescript decorators or logical puzzles.
            </p>
          </div>
          <Link
            to="/mentor/blogs"
            className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg text-center mt-6 transition shadow"
          >
            Launch Blogs Publisher
          </Link>
        </div>

        {/* Analytics preview / students list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <span className="text-2xl">👥</span>
            <h4 className="font-bold text-slate-800 text-sm mt-3">Student Enlistments</h4>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Review current students, track user registration, and view logs of student course completion credentials.
            </p>
          </div>

          <div className="mt-6">
            <div className="text-xs text-indigo-600 font-bold p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-center select-none">
              {stats?.uniqueStudents || 0} Enrolled Students
            </div>

            {Array.isArray(stats?.studentsList) && stats.studentsList.length > 0 && (
              <div className="mt-4 max-h-64 overflow-auto">
                <ul className="space-y-2">
                  {stats.studentsList.slice(0, 8).map((s) => (
                    <li
                      key={s._id}
                      className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>





      </div>
    </div>
  );
};

export default MentorDashboard;
