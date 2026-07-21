import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCourse } from '../../api/courses';
import { useToast } from '../../context/ToastContext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  // const [duration, setDuration] = useState('4 weeks');

  const [thumbnail, setThumbnail] = useState('');

  // Course-level crash course
  const [crashCourseVideoUrl, setCrashCourseVideoUrl] = useState('');

  const [crashCourseTitle, setCrashCourseTitle] = useState('Crash Course');
  
  // Array lists splitting by newline
  const [outcomesText, setOutcomesText] = useState('');
  const [prerequisitesText, setPrerequisitesText] = useState('');
  
  // Interactive Syllabus structure
  const [syllabus, setSyllabus] = useState([
    {
      week: 1,
      title: 'Introduction & Setup',
      description: 'Environment layout configuration details.',
      lessons: [
        { title: 'Welcome overview', duration: '10 mins', videoUrl: '', resourceUrl: '', description: '', order: 0 }
      ]
    }
  ]);

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

  // Lesson modifiers within a week
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
      error('Please fill in course title and description');
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
      const res = await createCourse({
        title,
        description,
        shortDescription,
        category,
        level,
        // duration field removed from UI
        thumbnail: thumbnail || undefined,

        crashCourse: {
          videoUrl: crashCourseVideoUrl || undefined,
          title: crashCourseTitle || undefined,
        },
        learningOutcomes: outcomesArray,
        prerequisites: preReqArray,
        syllabus,
      });

      if (res.success) {
        success('Course created successfully! 🎉');
        navigate('/mentor/courses');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-left">
      <Link to="/mentor/courses" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1.5 mb-6">
        &larr; Back to Studio
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-8">Course Architect</h1>

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


          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Thumbnail image URL (Optional)
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
              placeholder="A one-sentence summary for course cards..."
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
              placeholder="What will students learn?&#10;e.g. Develop React custom hooks&#10;e.g. Integrate RESTful endpoints"
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
              placeholder="What must students know?&#10;e.g. Basic knowledge of JavaScript ES6&#10;e.g. Node.js locally configured"
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>
        </div>



        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
        >
          {submitting ? 'Creating course...' : 'Publish Course Outline'}
        </button>

      </form>
    </div>
  );
};

export default CreateCourse;
