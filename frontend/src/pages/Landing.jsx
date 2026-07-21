import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses } from '../api/courses';
import { getMentors } from '../api/users';
import CourseCard from '../components/CourseCard';
import UserAvatar from '../components/UserAvatar';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user, isAuthenticated, logout } = useAuth();

  
  useEffect(() => {
    const scrollKey = 'learnplus_landing_scroll_y';
    const restoreKey = 'learnplus_landing_restore_on_back';

    // Save scroll when leaving Landing.
    const save = () => {
      try {
        sessionStorage.setItem(scrollKey, String(window.scrollY || 0));
      } catch (_) {}
    };

    // Only restore when the previous page explicitly requested it.
    const wantsRestore = sessionStorage.getItem(restoreKey) === '1';

    if (wantsRestore) {
      const y = sessionStorage.getItem(scrollKey);
      if (y !== null) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(y, 10) || 0);
        });
      }
    } else {
      // Strict behavior: always open from top for normal navigations into Landing
      window.scrollTo(0, 0);
    }

    // Clear the flag after handling restore.
    sessionStorage.removeItem(restoreKey);

    // Persist on unload/refresh.
    const onBeforeUnload = () => save();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const [featuredCourses, setFeaturedCourses] = useState([]);

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const coursesData = await getCourses({ limit: 3 });
        const mentorsData = await getMentors();
        setFeaturedCourses(coursesData.courses || []);
        setMentors(mentorsData.mentors || []);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const CATEGORIES = [
    { name: 'Web Development', icon: '💻', count: '9 Courses' },
    { name: 'App Development', icon: '📱', count: '9 Courses' },
    { name: 'Programming Languages', icon: '☕', count: '9 Courses' },
    { name: 'Data Structures & Algorithms', icon: '📊', count: '9 Courses' },
    { name: 'Machine Learning', icon: '🤖', count: '9 Courses' },
    { name: 'Artificial Intelligence', icon: '🧠', count: '9 Courses' },
    { name: 'Data Science', icon: '📈', count: '9 Courses' },
    { name: 'Cybersecurity', icon: '🛡️', count: '9 Courses' },
    { name: 'Cloud Computing', icon: '☁️', count: '9 Courses' },
    { name: 'DevOps', icon: '⚙️', count: '9 Courses' },
    { name: 'UI/UX Design', icon: '🎨', count: '9 Courses' },
    { name: 'Database Management', icon: '🗄️', count: '9 Courses' },
    { name: 'Aptitude & Interview Preparation', icon: '💼', count: '9 Courses' },
    { name: 'Blockchain & Web3', icon: '🔗', count: '9 Courses' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-12 lg:py-16">
        {/* Decorative background grid and shapes */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-cyan-500 rounded-full filter blur-[120px] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 mb-6 border border-indigo-500/30">
                🚀 100% Free Verifiable Learning
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-6">
                Master Industrial Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-300">Learn Plus</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
                Unlock 125+ free courses taught by verified mentors in Web Development, ML, Cybersecurity, DevOps, UI/UX, and Interview preparation. Track your progress and download blockchain-ready completion certificates.
              </p>
            <div className="flex flex-wrap gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition duration-200 text-center"
                    >
                      Create New Account
                    </Link>
                    <Link
                      to="/login"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-7 py-3.5 rounded-xl border border-slate-700 transition duration-200 text-center"
                    >
                      Sign In to Browse
                    </Link>
                  </>
                ) : (
                  <>
                    {user?.role === 'student' && (
                      <Link
                        to="/student/dashboard"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition duration-200 text-center"
                      >
                        Dashboard
                      </Link>
                    )}
                    {user?.role === 'mentor' && (
                      <Link
                        to="/mentor/dashboard"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition duration-200 text-center"
                      >
                        Mentor Dashboard
                      </Link>
                    )}
                    <Link
                      to={user?.role === 'mentor' ? '/mentor/profile' : '/student/profile'}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-10 py-3.5 rounded-xl border border-slate-700 transition duration-200 text-center"
                    >
                      Profile
                    </Link>
                   
                  </>
                )}
              </div>

            </div>

            {/* Premium Mockup/Visual */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-2xl relative">

                <div className="bg-slate-950 rounded-xl overflow-hidden aspect-[4/3] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500"></span>
                  </div>

                  {/* Hero Preview Image */}
                  <div className="my-4 flex-grow">
                    <img
                      src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Study laptop"
                      className="w-full h-full object-cover rounded-xl border border-slate-800"
                      loading="lazy"
                    />
                  </div>


                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Platform Stats Panel ─── */}
      <section className="relative z-20 -mt-2 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl py-6 px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-black text-slate-900">125+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5">Free Courses</p>
          </div>
          <div className="border-l border-slate-100">
            <p className="text-3xl font-black text-slate-900">14</p>
            <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5">Expert Categories</p>
          </div>
          <div className="border-l border-slate-100">
            <p className="text-3xl font-black text-indigo-600">100%</p>
            <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5">Free Curriculum</p>
          </div>
          <div className="border-l border-slate-100">
            <p className="text-3xl font-black text-slate-900">Online</p>
            <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5">Certificates</p>
          </div>
        </div>
      </section>

      {/* ─── Featured Courses Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated Resources</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">Featured Programs</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md">
              Start learning immediately with our most popular introductory classes across categories.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1.5 mt-4 md:mt-0"
          >
            Browse All Courses
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <p className="text-slate-500 font-medium">Connect and seed your MongoDB database to view courses!</p>
            <p className="text-xs text-slate-400 mt-1.5">Check out backend/README.md for instructions.</p>
          </div>
        )}
      </section>

      {/* ─── Categories Section ─── */}
      <section className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Diverse Ecosystem</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">Explore Learning Paths</h2>
            <p className="text-slate-500 text-sm mt-2">
              Browse structured courses covering backend systems, native devices, algorithms, AI pipelines, database schemas and design.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/courses', { state: { filterCategory: cat.name } })}
                className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md cursor-pointer hover:border-indigo-500 transition duration-200 flex items-center gap-3.5"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">{cat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mentors Section ─── */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Elite Faculty</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Meet Our Leading Mentors</h2>
          <p className="text-indigo-200/80 text-sm mt-2">
            Learn directly from academic directors, systems engineers, and research consultants with deep industry backgrounds.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mentors.map((m) => (
              <div
                key={m._id}
                className="bg-slate-300/20 backdrop-blur border border-slate-200/30 rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  sessionStorage.setItem('learnplus_landing_restore_on_back', '1');
                  navigate(`/mentors/${m._id}`);
                }}




                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                    sessionStorage.setItem('learnplus_landing_restore_on_back', '1');
                    navigate(`/mentors/${m._id}`);
                   }

                }}
              >


                <UserAvatar
                  user={m}
                  className="w-20 h-20 mx-auto mb-4 border-2 border-indigo-50"
                  textClassName="text-2xl"
                />
                <h3 className="font-bold text-white text-base">{m.name}</h3>
                <span className="text-[10px] font-bold text-indigo-200 uppercase bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/20">
                  {m.expertise?.[0] || 'Mentor'}
                </span>
                <p className="text-xs text-indigo-100/90 mt-3.5 line-clamp-3 leading-relaxed">
                  {m.bio}
                </p>
                <div className="flex justify-center gap-3.5 mt-5">
                  <span className="text-[10px] text-slate-400 font-semibold">{m.createdCourses?.length || 0} Courses Created</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            No mentors seeded yet. They will appear here once the database is loaded.
          </div>
        )}
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Success Circles</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">What Students Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Learn Plus has completely changed how I learn. The courses are structured, detailed, and completely free. The certificates allowed me to show my skills directly on my LinkedIn profile."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop"
                  alt="Reviewer"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Emily Parker</p>
                  <p className="text-[10px] text-slate-400">Full-Stack Student</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "As someone transitioning from business into data science, the Statistics and Python modules were a savior. No high-level complex math blocks, just clear tutorials and direct coding files."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop"
                  alt="Reviewer"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">David Miller</p>
                  <p className="text-[10px] text-slate-400">Data Analytics Associate</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "I completed the React and Node.js syllabi in less than two months. The certificate download worked instantly and the seeder project templates are amazing for copy-pasting code setups."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop"
                  alt="Reviewer"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Samantha Lee</p>
                  <p className="text-[10px] text-slate-400">Junior Frontend Dev</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Call to Action ─── */}
      <section className="bg-indigo-600 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4">Start Learning For Free Today</h2>
          <p className="text-indigo-100 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Create your profile, select your role, enroll in any of our 125+ programs, and start compiling your next verified credential.
          </p>

          {/* Hide Register/Login CTAs once user/mentor is logged in */}
          {!isAuthenticated ? (
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="bg-white hover:bg-slate-50 text-indigo-600 font-bold px-7 py-3 rounded-xl shadow-md transition"
              >
                Get Started (Register)
              </Link>
              <Link
                to="/login"
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-7 py-3 rounded-xl border border-indigo-500/30 transition"
              >
                Login to Account
              </Link>
            </div>
          ) : (
            <div className="hidden" />
          )}
        </div>
      </section>

    </div>
  );
};

export default Landing;
