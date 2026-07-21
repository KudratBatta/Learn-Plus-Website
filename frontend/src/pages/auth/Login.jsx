import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = location.state?.from?.pathname || 
        (user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard');
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      success(`Welcome back, ${res.user.name}! 👋`);
    } else {
      error(res.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 font-black text-2xl text-slate-900 tracking-tight mb-2.5">
            <span className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-base shadow-sm">
              L+
            </span>
            Learn<span className="text-indigo-600">Plus</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Sign in to your account</h2>
          <p className="text-slate-400 text-xs mt-1.5">
            Welcome back! Please enter your details below.
          </p>
        </div>

        {/* Quick Credentials Info */}
        <div className="mb-6 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[11px] text-slate-600 leading-normal">
          <p className="font-bold text-indigo-700 mb-1">Demo Access Credentials:</p>
          <div className="flex flex-col gap-0.5 font-mono">
            <span>Student: <strong className="text-slate-800">student@learnplus.com</strong> / password123</span>
            <span>Mentor: <strong className="text-slate-800">sarah@learnplus.com</strong> / password123</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@learnplus.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="text-left">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-xs">
          <span className="text-slate-400">Don't have an account? </span>
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
