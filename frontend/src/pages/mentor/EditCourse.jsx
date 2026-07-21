import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCourseById, updateCourse } from '../../api/courses';
import { useToast } from '../../context/ToastContext';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('4 weeks');
  const [thumbnail, setThumbnail] = useState('');

  // Course-level crash course
  const [crashCourseVideoUrl, setCrashCourseVideoUrl] = useState('');
  const [crashCourseTitle, setCrashCourseTitle] = useState('Crash Course');
  
  // Array lists
  const [outcomesText, setOutcomesText] = useState('');
  const [prerequisitesText, setPrerequisitesText] = useState('');
  
  // Syllabus builder
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES = [
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

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await getCourseById(id);
        const c = res.course;
        setTitle(c.title);
        setDescription(c.description);
        setShortDescription(c.shortDescription || '');
        setCategory(c.category);
        setLevel(c.level);
        setDuration(c.duration);
        setThumbnail(c.thumbnail || '');
        setOutcomesText(c.learningOutcomes?.join('\n') || '');
        setPrerequisitesText(c.prerequisites?.join('\n') || '');
        setSyllabus(c.syllabus || []);
      } catch (err) {
        console.error('Failed to load course details:', err);
        error('Failed to fetch course data.');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  // Syllabus modifiers
  const handleAddWeek = () => {
    setSyllabus((prev) => [
      ...prev,
      {
        week: prev.length + 1,
        title: '',
        description: '',
        lessons: [{ title: '', duration: '10 mins', videoUrl: '', resourceUrl: '', description: '', order: 0 }]
      }
    ]);
  };

  const handleRemoveWeek = (index) => {
    setSyllabus((prev) => prev.filter((_, idx) => idx !== index).map((w, idx) => ({ ...w, week: idx + 1 })));
  };

  const handleWeekChange = (index, field, val) => {
    setSyllabus((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  // Lesson modifiers
  const handleAddLesson = (weekIndex) => {
    setSyllabus((prev) => {
      const copy = [...prev];
      copy[weekIndex].lessons.push({
        title: '',
        duration: '10 mins',
        videoUrl: '',
        resourceUrl: '',
        description: '',
        order: copy[weekIndex].lessons.length
      });
      return copy;
    });
  };

  const handleRemoveLesson = (weekIndex, lessonIndex) => {
    setSyllabus((prev) => {
      const copy = [...prev];
      copy[weekIndex].lessons = copy[weekIndex].lessons.filter((_, idx) => idx !== lessonIndex);
      return copy;
    });
  };

  const handleLessonChange = (weekIndex, lessonIndex, field, val) => {
    setSyllabus((prev) => {
      const copy = [...prev];
      copy[weekIndex].lessons[lessonIndex][field] = val;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      error('Please write titles and descriptions');
      return;
    }

    setSubmitting(true);
    const outcomesArray = outcomesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const preReqArray = prerequisitesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await updateCourse(id, {
        title,
        description,
        shortDescription,
        category,
        level,
        duration,
        thumbnail,
        crashCourse: {
          videoUrl: crashCourseVideoUrl || undefined,
          title: crashCourseTitle || undefined,
        },
        learningOutcomes: outcomesArray,
        prerequisites: preReqArray,
        syllabus,
      });

      if (res.success) {
        success('Course syllabus updated! 🎉');
        navigate('/mentor/courses');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing course files...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-left">
      <Link to="/mentor/courses" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1.5 mb-6">
        &larr; Back to Studio
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-8">Edit Course Syllabus</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core fields card */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2">Core Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Course Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Masterclass in React.js"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Duration (e.g. 4 weeks)
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 5 weeks"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Thumbnail image URL
            </label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Crash Course Video URL (YouTube Embed URL)
            </label>
            <input
              type="text"
              value={crashCourseVideoUrl}
              onChange={(e) => setCrashCourseVideoUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/embed/<id>?start=0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Crash Course Title
            </label>
            <input
              type="text"
              value={crashCourseTitle}
              onChange={(e) => setCrashCourseTitle(e.target.value)}
              placeholder="e.g. React Crash Course"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Short Description
            </label>

            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A one-sentence summary..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Full Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Complete overview of the curriculum coverage..."
              rows="4"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Outcomes & Prerequisites details */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2">Outcomes & Criteria</h3>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Learning Outcomes (One outcome per line)
            </label>
            <textarea
              value={outcomesText}
              onChange={(e) => setOutcomesText(e.target.value)}
              placeholder="What will students learn?&#10;e.g. Develop React custom hooks"
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Prerequisites (One prerequisite per line)
            </label>
            <textarea
              value={prerequisitesText}
              onChange={(e) => setPrerequisitesText(e.target.value)}
              placeholder="What must students know?&#10;e.g. Basic knowledge of JavaScript ES6"
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Syllabus Builder */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Syllabus Outline Builder</h3>
            <button
              type="button"
              onClick={handleAddWeek}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition"
            >
              ➕ Add Week
            </button>
          </div>

          {syllabus.map((week, wIdx) => (
            <div key={wIdx} className="p-5 bg-slate-50 rounded-xl border border-slate-200/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Week {week.week}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveWeek(wIdx)}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold transition"
                >
                  Remove Week
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    value={week.title}
                    onChange={(e) => handleWeekChange(wIdx, 'title', e.target.value)}
                    placeholder="Week Title (e.g. Getting Started)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={week.description}
                    onChange={(e) => handleWeekChange(wIdx, 'description', e.target.value)}
                    placeholder="Brief description of this week's goals..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Lessons Stack */}
              <div className="space-y-3 pt-3 border-t border-slate-200/60">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lessons list</span>
                  <button
                    type="button"
                    onClick={() => handleAddLesson(wIdx)}
                    className="text-[10px] font-bold text-indigo-600 hover:underline"
                  >
                    ➕ Add Lesson
                  </button>
                </div>

                {week.lessons?.map((less, lIdx) => (
                  <div key={lIdx} className="bg-white p-3 rounded-lg border border-slate-200/40 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        required
                        value={less.title}
                        onChange={(e) => handleLessonChange(wIdx, lIdx, 'title', e.target.value)}
                        placeholder="Lesson Title"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={less.duration}
                        onChange={(e) => handleLessonChange(wIdx, lIdx, 'duration', e.target.value)}
                        placeholder="Duration (e.g. 15 mins)"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <input
                        type="text"
                        value={less.videoUrl}
                        onChange={(e) => handleLessonChange(wIdx, lIdx, 'videoUrl', e.target.value)}
                        placeholder="Video Embed URL"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(wIdx, lIdx)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
        >
          {submitting ? 'Saving changes...' : 'Save Syllabus Changes'}
        </button>

      </form>
    </div>
  );
};

export default EditCourse;
