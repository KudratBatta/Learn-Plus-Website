import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMentorById } from '../api/users';
import CourseCard from '../components/CourseCard';
import UserAvatar from '../components/UserAvatar';
import { useToast } from '../context/ToastContext';

const MentorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error } = useToast();

  const [mentor, setMentor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMentorById(id);

        // Different backends sometimes return { mentor } or { mentors }.
        const m = res?.mentor || res?.mentors?.[0] || res;
        setMentor(m);

        // Expected shape: mentor.createdCourses (array of courses or ids)
        const created = m?.createdCourses || m?.courses || [];
        setCourses(created);

        // If backend returns ids only, try to keep UI from crashing.
        // (CourseCard expects full course objects; seed data usually returns populated courses.)
        if (Array.isArray(created) && created.length > 0 && !created[0]?._id) {
          setCourses([]);
        }
      } catch (err) {
        console.error('Failed to load mentor details:', err);
        error('Failed to load mentor details.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Loading mentor profile...</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold text-slate-800 mt-4">Mentor Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-indigo-600 font-semibold text-sm hover:underline mt-2 inline-block"
        >
          Go back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Header */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <UserAvatar
              user={mentor}
              className="w-16 h-16 ring-4 ring-indigo-50 bg-slate-50"
              textClassName="text-2xl"
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{mentor.name}</h1>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded uppercase tracking-wider">
                  Mentor
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed">{mentor.bio}</p>

              {Array.isArray(mentor.expertise) && mentor.expertise.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 6).map((ex, idx) => (
                    <span
                      key={`${ex}-${idx}`}
                      className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-1 rounded"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-2">
          Courses by {mentor.name}
        </h2>
        <p className="text-slate-500 text-sm mb-8">Browse all programs created by this mentor.</p>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <span className="text-3xl">📚</span>
            <h3 className="text-sm font-bold text-slate-800 mt-3">No courses found</h3>
            <p className="text-slate-400 text-xs mt-1.5">This mentor hasn't published courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDetails;

