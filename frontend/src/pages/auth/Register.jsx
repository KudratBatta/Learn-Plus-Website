import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated, user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      error('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    const res = await register(name, email, password, role);
    setSubmitting(false);

    if (res.success) {
      success(`Welcome to Learn Plus, ${res.user.name}! 🎉`);
    } else {
      error(res.message || 'Registration failed. Email might be in use.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 font-black text-2xl text-slate-900 tracking-tight mb-2.5">
            <span className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-base shadow-sm">
              L+
            </span>
            Learn<span className="text-indigo-600">Plus</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Create new account</h2>
          <p className="text-slate-400 text-xs mt-1.5">
            Choose your role and register your free account below.
          </p>
        </div>

        {/* Role Selector Badges */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`w-1/2 text-xs font-bold py-2.5 rounded-lg transition-all ${
              role === 'student'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎓 I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('mentor')}
            className={`w-1/2 text-xs font-bold py-2.5 rounded-lg transition-all ${
              role === 'mentor'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            👨‍🏫 I am a Mentor
          </button>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

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
              placeholder="e.g. johndoe@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
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
                Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-xs">
          <span className="text-slate-400">Already have an account? </span>
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
