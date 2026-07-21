import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getMyCertificates } from '../../api/users';
import { getMyEnrolledCourses } from '../../api/courses';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProgressBar from '../../components/ProgressBar';
import Certificate from '../../components/Certificate';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { error } = useToast();

  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'certificates'
  const [selectedCertificate, setSelectedCertificate] = useState(null); // Modal viewer

  const loadDashboardData = async () => {
    try {
      const statsRes = await getDashboardStats();
      setStats(statsRes.stats);

      const enrolledRes = await getMyEnrolledCourses();
      setEnrollments(enrolledRes.enrollments || []);

      const certRes = await getMyCertificates();
      setCertificates(certRes.certificates || []);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
      error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing student logs...</p>
      </div>
    );
  }

  // Calculate completed courses
  const completedCount = enrollments.filter((e) => e.progress === 100).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Student Dashboard</h1>
          <p className="text-slate-500 text-xs mt-1">
            Welcome back, <strong className="text-slate-700">{user?.name}</strong>! Resume your learning or claim your verifiable certificates.
          </p>
        </div>
        <Link
          to="/student/profile"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 transition text-center"
        >
          Edit Profile
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
            📚
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850">{enrollments.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Enrolled Courses</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center text-lg">
            🎓
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850">{completedCount}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Completed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-lg">
            🏆
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850">{certificates.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Certificates Earned</p>
          </div>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 max-w-xs">
        <button
          onClick={() => setActiveTab('courses')}
          className={`w-1/2 text-xs font-bold py-2 rounded-lg transition ${
            activeTab === 'courses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          My Courses ({enrollments.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`w-1/2 text-xs font-bold py-2 rounded-lg transition ${
            activeTab === 'certificates' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Certificates ({certificates.length})
        </button>
      </div>

      {/* TAB Content: Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.length > 0 ? (
            enrollments.map((enr) => (
              <div key={enr._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5 items-center">
                {/* Thumbnail */}
                <img
                  src={enr.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                  alt={enr.course?.title}
                  className="w-full sm:w-28 aspect-video rounded-xl object-cover bg-slate-100 border border-slate-50"
                />
                
                {/* Details */}
                <div className="flex-grow flex flex-col justify-between h-full w-full">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                      {enr.course?.category}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mt-1">{enr.course?.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Instructor: {enr.course?.mentor?.name}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex-grow max-w-xs">
                      {/* Only show progress/seek UI for completed courses (avoid showing 0% / bar when not complete) */}
                      {enr.progress === 100 ? (
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">100% Completed</span>
                      ) : null}
                    </div>

                    {enr.progress === 100 ? (
                      <button
                        type="button"
                        onClick={() => {
                          // Go to the completed course page
                          setSelectedCertificate(null);
                          window.location.href = `/courses/${enr.course?._id}`;


                        }}
                        className={`text-white text-xs font-bold px-3 py-2 rounded-lg transition bg-emerald-600 hover:bg-emerald-700`} 
                        style={{ cursor: 'pointer' }}



                      >
                        Review
                      </button>
                    ) : (
                      <Link
                        to={`/courses/${enr.course?._id}`}
                        className={`text-white text-xs font-bold px-3 py-2 rounded-lg transition bg-indigo-600 hover:bg-indigo-700 cursor-pointer`}



                      >
                        Resume
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-16 bg-white border border-slate-100 rounded-2xl">
              <span className="text-3xl">🏜️</span>
              <h3 className="text-sm font-bold text-slate-800 mt-3">No Enrolled Courses</h3>
              <p className="text-slate-400 text-xs mt-1">
                You haven't enrolled in any courses yet. Browse the catalog to start!
              </p>
              <Link
                to="/courses"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow mt-4 inline-block transition"
              >
                Explore Courses
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB Content: Certificates */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.length > 0 ? (
            certificates.map((cert) => (
              <div key={cert._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between gap-5">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                    OFFICIAL DIPLOMA
                  </span>
                  <h3 className="font-bold text-slate-850 text-sm mt-1">{cert.course?.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {cert.certificateId}</p>
                </div>
                <button
                  onClick={() => setSelectedCertificate(cert)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm"
                >
                  View / Claim
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-16 bg-white border border-slate-100 rounded-2xl">
              <span className="text-3xl">🏆</span>
              <h3 className="text-sm font-bold text-slate-800 mt-3">No Certificates Claimed</h3>
              <p className="text-slate-400 text-xs mt-1">
                Complete any course to 100% progress and generate official verifiable certificates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal Viewer */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 relative shadow-2xl">

            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
            >
              &times;
            </button>
            <div className="mt-4 flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <Certificate certificate={{ ...selectedCertificate, student: user }} />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
