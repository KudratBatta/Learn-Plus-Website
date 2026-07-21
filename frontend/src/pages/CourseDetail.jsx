import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, enrollInCourse, rateCourse, getAIRecommendations, completeCourse } from '../api/courses';
import { generateCertificate } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';


import CourseCard from '../components/CourseCard';
import UserAvatar from '../components/UserAvatar';

const YouTubeCrashPlayer = ({ videoUrl, title, onComplete, onProgressUpdate }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const completeCalledRef = useRef(false);
  const intervalRef = useRef(null);

  const extractVideoId = (url) => {
    try {
      if (!url) return null;

      // 1) Already an embed URL: /embed/VIDEOID
      const embedMatch = url.match(/\/embed\/([^?&/]+)/);
      if (embedMatch?.[1]) return embedMatch[1];

      // 2) Watch URL: v=VIDEOID
      const watchMatch = url.match(/[?&]v=([^?&/]+)/);
      if (watchMatch?.[1]) return watchMatch[1];

      // 3) youtu.be/VIDEOID
      const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
      if (shortMatch?.[1]) return shortMatch[1];

      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!videoUrl || !containerRef.current) return;

    const videoId = extractVideoId(videoUrl);
    if (!videoId) return;

    let disposed = false;

    const ensureYT = () => {
      if (window.YT && window.YT.Player) return Promise.resolve();
      return new Promise((resolve) => {
        const existing = document.getElementById('yt-iframe-api');
        if (existing) {
          window.onYouTubeIframeAPIReady = () => resolve();
          return;
        }
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => resolve();
      });
    };

    const tick = () => {
      try {
        const player = playerRef.current;
        if (!player || !window.YT) return;

        const duration = player.getDuration?.() || 0;
        const currentTime = player.getCurrentTime?.() || 0;

        if (duration > 0) {
          const remaining = duration - currentTime;
          const canComplete = remaining <= 300; // last 5 minutes
          onProgressUpdate?.(canComplete);
        }
      } catch {}
    };

    const setup = async () => {
      await ensureYT();
      if (disposed) return;

      try {
        playerRef.current?.destroy?.();
      } catch {}

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 0, rel: 0 },
        events: {
          onStateChange: (event) => {
            const YT = window.YT;
            if (!YT) return;
            if (event.data === YT.PlayerState.ENDED) {
              if (completeCalledRef.current) return;
              completeCalledRef.current = true;
              onComplete?.();
              onProgressUpdate?.(true);
            }
          },
        },
      });

      if (intervalRef.current) {
        try {
          clearInterval(intervalRef.current);
        } catch {}
      }
      intervalRef.current = setInterval(tick, 1000);
      tick();
    };

    setup();

    return () => {
      disposed = true;
      if (intervalRef.current) {
        try {
          clearInterval(intervalRef.current);
        } catch {}
        intervalRef.current = null;
      }
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [videoUrl]);

  return <div className="w-full h-full" ref={containerRef} aria-label={title} />;
};

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [canMarkComplete, setCanMarkComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview'); // overview, reviews
  const [recommendations, setRecommendations] = useState([]);

  // Review inputs
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [claimingCert, setClaimingCert] = useState(false);

  const fetchCourseDetails = async () => {
    try {
      const res = await getCourseById(id);
      setCourse(res.course);
      setEnrollment(res.enrollment);
      setCanMarkComplete(false);
    } catch (err) {
      console.error('Error fetching course:', err);
      error('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getAIRecommendations();
      const filtered = res.recommendations?.filter((c) => c._id !== id).slice(0, 3) || [];
      setRecommendations(filtered);
    } catch (err) {
      console.error('Error getting recommendations:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCourseDetails();
    fetchAIRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    try {
      const res = await enrollInCourse(id);
      if (res.success) {
        success('Enrolled successfully! Enjoy your learning! 🎓');
        setEnrollment(res.enrollment);
        refreshUser();
        setCanMarkComplete(false);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Enrollment failed.');
    }
  };

  const handleClaimCertificate = async () => {
    setClaimingCert(true);
    try {
      const res = await generateCertificate(course._id);
      if (res.success) {
        success('Certificate generated successfully! View it in your dashboard.');
        setEnrollment((prev) => ({ ...prev, certificateIssued: true }));
        refreshUser();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to generate certificate.');
    } finally {
      setClaimingCert(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      error('Please write a review text');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await rateCourse(course._id, rating, review);
      if (res.success) {
        success('Thank you for rating this course!');
        setCourse((prev) => ({
          ...prev,
          ratings: res.ratings,
          averageRating: res.averageRating,
        }));
        setReview('');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const topicsCovered = course?.learningOutcomes || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing course materials...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold text-slate-800 mt-4">Course Not Found</h2>
        <Link to="/courses" className="text-indigo-600 font-semibold text-sm hover:underline mt-2 inline-block">
          Go back to Courses
        </Link>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900 text-white rounded-2xl overflow-hidden p-6 sm:p-10 mb-8 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full filter blur-[120px] opacity-10" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 text-left">
            <div className="flex gap-2 mb-4">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-indigo-500/30">
                {course.category}
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                {course.level}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-4">{course.title}</h1>
            <p className="text-slate-300 text-sm mb-6 max-w-xl leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Curated by:</span>
                <span className="font-bold text-slate-200">{course.mentor?.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Rating:</span>
                <span className="font-bold text-yellow-400">★ {course.averageRating || '4.5'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-950/40 p-5 rounded-xl border border-slate-800 backdrop-blur-sm w-full">
            {isEnrolled ? (
              <div className="flex flex-col gap-4 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Progress</p>
                <div className="text-xs text-slate-400">
                  {enrollment.progress === 100 ? 'Course completed.' : 'Complete the crash course video to unlock your certificate.'}
                </div>


                {enrollment.progress === 100 ? (
                  enrollment.certificateIssued ? (
                    <Link
                      to="/student/dashboard"
                      className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-sm transition"
                    >
                      View Certificate ✅
                    </Link>
                  ) : (
                    <button
                      onClick={handleClaimCertificate}
                      disabled={claimingCert}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {claimingCert ? 'Generating...' : 'Claim Certificate 🏆'}
                    </button>
                  )
                ) : (
                  <span className="text-slate-400 text-xs italic text-center">
                    Watch the crash course video to unlock completion.
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Tuition Rate</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">100% Free Course</p>
                </div>

                {user?.role === 'student' ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-lg text-sm transition"
                  >
                    Enroll Now (Free)
                  </button>
                ) : user?.role === 'mentor' ? (
                  <p className="text-xs text-slate-400 italic text-center">Mentors cannot enroll in courses.</p>
                ) : (
                  <Link
                    to="/login"
                    className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-lg text-sm transition block"
                  >
                    Sign In to Enroll
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {isEnrolled ? (
            <>
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                      Crash Course
                    </span>
                    <span className="text-xs font-bold text-slate-700">A guided learning experience</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Follow this curated video from start to finish, then mark the course complete.
                  </p>
                </div>

                <div className="aspect-video bg-slate-900">
                  {course?.crashCourse?.videoUrl ? (
                    <YouTubeCrashPlayer
                      videoUrl={course.crashCourse.videoUrl}
                      title={course.crashCourse.title || 'Crash Course'}
                      onProgressUpdate={(canComplete) => setCanMarkComplete(canComplete)}
                      onComplete={async () => {
                        if (!course?._id || !enrollment) return;
                        if (enrollment.progress === 100 && enrollment.certificateIssued) return;
                        try {
                          const res = await completeCourse(course._id);
                          if (res?.success) {
                            setEnrollment((prev) => ({
                              ...(prev || {}),
                              progress: 100,
                              completedAt: res.enrollment?.completedAt || new Date().toISOString(),
                              certificateIssued: true,
                            }));
                            refreshUser();
                            success('Course completed! Certificate generated instantly ✅');
                          }
                        } catch (err) {
                          console.error('Failed to complete course:', err);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white">
                      <span className="text-4xl">🎬</span>
                      <p className="font-bold">Crash course video not configured</p>
                      <p className="text-[10px] text-slate-300 mt-2">Ask your mentor to set a crash video for this course.</p>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    
                    {enrollment?.progress === 100 ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                        Completed ✅
                      </span>
                    ) : (
                      <button
                        onClick={async () => {
                          if (!canMarkComplete) return;
                          if (!course?._id || !enrollment) return;
                          try {
                            const res = await completeCourse(course._id);
                            if (res?.success) {
                              setEnrollment((prev) => ({
                                ...(prev || {}),
                                progress: 100,
                                completedAt: res.enrollment?.completedAt || new Date().toISOString(),
                                certificateIssued: true,
                              }));
                              refreshUser();
                              success('Marked complete! Certificate generated instantly ✅');
                            }
                          } catch (err) {
                            console.error(err);
                            error('Failed to mark complete.');
                          }
                        }}
                        disabled={!canMarkComplete}
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition ${
                          !canMarkComplete ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Topics Covered</h3>
                    <ul className="mt-3 space-y-1">
                      {(topicsCovered || []).length > 0 ? (
                        topicsCovered.map((t, idx) => (
                          <li key={idx} className="text-xs text-slate-700">• {t}</li>
                        ))
                      ) : (
                        <li className="text-xs text-slate-400">• Topics will appear here once configured.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Benefits / What You’ll Learn</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      After completing the crash course video, you’ll gain a practical understanding of the key concepts
                      and be able to apply them confidently.
                    </p>

                    {(topicsCovered || []).length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {topicsCovered.slice(0, 6).map((t, idx) => (
                          <li key={idx} className="text-xs text-slate-700">✓ {t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6 max-w-sm">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-1/2 text-xs font-bold py-2 rounded-lg transition ${
                    activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-1/2 text-xs font-bold py-2 rounded-lg transition ${
                    activeTab === 'reviews' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Reviews ({course.ratings?.length || 0})
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Topics Covered</h3>
                    <ul className="space-y-2">
                      {(topicsCovered || []).length > 0 ? (
                        topicsCovered.map((t, idx) => (
                          <li key={idx} className="text-xs text-slate-700">• {t}</li>
                        ))
                      ) : (
                        <li className="text-xs text-slate-400">• Topics will appear here once configured.</li>
                      )}
                    </ul>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Benefits / What You’ll Learn</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Complete the crash course video to build your foundation and achieve clear outcomes.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                    <h3 className="text-3xl font-black text-slate-800">{course.averageRating || '4.5'}</h3>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Out of 5 stars</p>
                      <div className="text-yellow-400 font-bold text-sm">★★★★★</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {course.ratings?.map((r, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <UserAvatar user={r.user} className="w-6 h-6" />
                            <span className="text-xs font-bold text-slate-700">{r.user?.name || 'Jane Student'}</span>
                          </div>
                          <span className="text-xs text-yellow-400 font-bold">★ {r.rating}</span>
                        </div>
                        <p className="text-xs text-slate-500 italic leading-relaxed">{r.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar: Lead Mentor (curator) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lead Mentor</h3>

            <div className="flex items-center gap-3.5 mb-4">
              <UserAvatar
                user={course.mentor}
                className="w-12 h-12 border-2 border-indigo-50"
                textClassName="text-base"
              />
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-800">{course.mentor?.name}</h4>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold uppercase">
                  Curator & Instructor
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">{course.mentor?.bio}</p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Learning Path Intent</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The crash course video is integrated into this curated learning path—so you know exactly what to learn and why.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AI Recommendations Section ─── */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="border-t border-slate-200 pt-16">
          <div className="text-left mb-8">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">🤖 Smart Assistant Recommendations</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">Recommended for You</h2>
            <p className="text-slate-500 text-xs mt-1.5">Based on your catalog interests and category footprints.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((recCourse) => (
              <CourseCard key={recCourse._id} course={recCourse} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Review/Rating form if enrolled ─── */}
      {isEnrolled && (
        <section className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm text-left max-w-xl">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Leave a Review</h3>
          <p className="text-xs text-slate-400 mb-4">Share your feedback to help improve this course.</p>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-650">Star Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="5">★★★★★ (5/5)</option>
                <option value="4">★★★★☆ (4/5)</option>
                <option value="3">★★★☆☆ (3/5)</option>
                <option value="2">★★☆☆☆ (2/5)</option>
                <option value="1">★☆☆☆☆ (1/5)</option>
              </select>
            </div>

            <div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you like or dislike about this course?"
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default CourseDetail;

