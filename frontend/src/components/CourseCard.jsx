import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';

const CourseCard = ({ course, isEnrolled, progress, onEnroll, onUnenroll }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
      
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail || placeholderImage}
          alt={course.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = placeholderImage;
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-slate-900/80 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded backdrop-blur-sm">
            {course.category}
          </span>
          <span className={`border text-[10px] font-bold px-2 py-1 rounded ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-700">{course.averageRating || '4.5'}</span>
            
          </div>

          <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-2 hover:text-indigo-600 transition">
            <Link to={`/courses/${course._id}`}>{course.title}</Link>
          </h3>
          
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {course.shortDescription || course.description}
          </p>
        </div>

        <div>
          {/* Metadata */}
          <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-50 pt-4 mb-4">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Crash Course</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Free</span>
            </div>
          </div>


          {/* Mentor & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar
                user={course.mentor}
                className="w-7 h-7 ring-1 ring-slate-100"
              />
              <span className="text-xs font-semibold text-slate-700 line-clamp-1">
                {course.mentor?.name}
              </span>


            </div>

            {isEnrolled ? (
              <div className="flex flex-col items-end gap-1.5">
                {progress > 0 && progress !== 100 && (
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {progress}% Complete
                  </span>
                )}

                {progress === 100 ? (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      Completed
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <Link
                      to={`/courses/${course._id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                    >
                      Resume
                    </Link>

                    {onUnenroll && (
                      <button
                        type="button"
                        onClick={() => onUnenroll(course._id)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-bold px-3 py-1.5 rounded transition"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : onEnroll ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEnroll(course._id)}
                  className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                >
                  Enroll Free
                </button>
              </div>
            ) : (
              <Link
                to={`/courses/${course._id}`}
                className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded transition"
              >
                View Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
