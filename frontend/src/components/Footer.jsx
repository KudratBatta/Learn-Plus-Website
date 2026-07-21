import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { user, isAuthenticated } = useAuth();

  const goTo = (path) => {
    // ScrollToTop is handled globally on route change.
    return path;
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Brand Info */}
          <div className="md:col-span-1">
            <span className="flex items-center gap-2 text-white font-black text-xl mb-4">
              <span className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-base">
                L+
              </span>
              LearnPlus
            </span>
            <p className="text-xs  text-slate-350 leading-relaxed mb-4">
              A comprehensive open-source e-learning architecture enabling peer mentors and student circles to deploy fully customized syllabi, track completions, and earn verifiable credentials.
            </p>
            <p className="text-[10px] text-slate-400">
              &copy; {new Date().getFullYear()} LearnPlus Inc. All rights reserved.
            </p>
          </div>

          {/* Catalog categories preview */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/courses"
                  state={{ filterCategory: 'Web Development' }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  state={{ filterCategory: 'Machine Learning' }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Machine Learning
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  state={{ filterCategory: 'Cybersecurity' }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  state={{ filterCategory: 'UI/UX Design' }}
                  className="hover:text-white transition cursor-pointer"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  state={{ filterCategory: 'Aptitude & Interview Preparation' }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Aptitude & Interview Prep
                </Link>
              </li>
            </ul>

          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className="hover:text-white transition cursor-pointer"
                >
                  Home Landing
                </Link>
              </li>

              <li>
                <Link
                  to="/courses"
                  state={{ filterCategory: 'All' }}
                  className="hover:text-white transition cursor-pointer"
                >
                  Catalog Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-white transition cursor-pointer"
                >
                  Article Feed
                </Link>
              </li>

              {/* Role-based destinations */}
              {isAuthenticated && user?.role === 'student' && (
                <li>
                  <Link
                    to="/student/dashboard"
                    className="hover:text-white transition cursor-pointer"
                  >
                    Student Portal
                  </Link>
                </li>
              )}
              {isAuthenticated && user?.role === 'mentor' && (
                <li>
                  <Link
                    to="/mentor/dashboard"
                    className="hover:text-white transition cursor-pointer"
                  >
                    Instructor Desk
                  </Link>
                </li>
              )}

            </ul>
          </div>


          {/* Contact Details */}
         
<div>
  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
    Get in Touch
  </h4>

  <p className="text-xs leading-relaxed mb-4 text-slate-350">
    Need help with enrollment, certificates, mentor onboarding, or technical issues? Contact the LearnPlus support team anytime.
  </p>

  <div className="space-y-2 text-xs text-slate-400">
    <p>📧 learnplus.team@gmail.com</p>
    <p>📍 Online Learning Platform</p>
  
  </div>
</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
