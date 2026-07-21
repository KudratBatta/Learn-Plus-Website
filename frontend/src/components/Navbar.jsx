import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to logout?');
    if (!shouldLogout) return;
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const activeStyle = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 py-1.5 px-3 rounded-md ${
      isActive
        ? 'text-indigo-600 bg-indigo-50/50'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-black text-xl text-slate-900 tracking-tight">
          <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-200">
            L+
          </span>
          <span>Learn<span className="text-indigo-600">Plus</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/" end className={activeStyle}>Home</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/courses" className={activeStyle}>Courses</NavLink>
              <NavLink to="/blogs" className={activeStyle}>Blogs</NavLink>
              {user?.role === 'student' && (
                <NavLink to="/student/dashboard" className={activeStyle}>Student Dashboard</NavLink>
              )}
              {user?.role === 'mentor' && (
                <NavLink to="/mentor/dashboard" className={activeStyle}>Mentor Dashboard</NavLink>
              )}
            </>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none hover:bg-slate-50 p-1.5 rounded-lg transition"
              >
                <UserAvatar
                  user={user}
                  className="w-8 h-8 ring-2 ring-indigo-50"
                />
                <span className="text-sm font-bold text-slate-700 max-w-[120px] truncate">{user.name}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-[110] animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to={user.role === 'mentor' ? '/mentor/profile' : '/student/profile'}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition text-left"
                  >
                    <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
              <div className="flex items-center gap-3">
                {/* Auth links hidden from Landing page as requested */}
              </div>
          )}
        </div>

        {/* Mobile Hamburger menu */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-500 focus:outline-none p-1.5 rounded-lg hover:bg-slate-50"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 px-4 py-4 flex flex-col gap-3 shadow-md animate-fade-in">
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className={activeStyle}>Home</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/courses" onClick={() => setMenuOpen(false)} className={activeStyle}>Courses</NavLink>
              <NavLink to="/blogs" onClick={() => setMenuOpen(false)} className={activeStyle}>Blogs</NavLink>
              {user?.role === 'student' && (
                <NavLink to="/student/dashboard" onClick={() => setMenuOpen(false)} className={activeStyle}>Student Dashboard</NavLink>
              )}
              {user?.role === 'mentor' && (
                <NavLink to="/mentor/dashboard" onClick={() => setMenuOpen(false)} className={activeStyle}>Mentor Dashboard</NavLink>
              )}
            </>
          )}

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-1.5">
                  <UserAvatar
                    user={user}
                    className="w-9 h-9"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={user.role === 'mentor' ? '/mentor/profile' : '/student/profile'}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-50 transition"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 pt-1">
                {/* Auth links hidden from Landing page as requested */}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
