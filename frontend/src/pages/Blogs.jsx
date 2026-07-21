import React, { useEffect, useState } from 'react';
import { getBlogs } from '../api/blogs';
import BlogCard from '../components/BlogCard';
import { useToast } from '../context/ToastContext';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { error } = useToast();

  const CATEGORIES = ['All', 'Web Development', 'Machine Learning', 'Programming Languages', 'Cloud Computing', 'UI/UX Design', 'General'];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await getBlogs({
          category: category === 'All' ? undefined : category,
          search: search || undefined,
        });
        setBlogs(res.blogs || []);
      } catch (err) {
        console.error('Failed to load blogs:', err);
        error('Failed to retrieve blogs.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-left mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Technical Blogs</h1>
        <p className="text-slate-500 text-sm mt-1.5 max-w-xl">
          Deepen your conceptual bounds. Learn about subnets, compilers, systems design, and layout architectures.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search article titles, keywords..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories Bar */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-md w-full md:w-auto whitespace-nowrap transition ${
                category === cat
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of articles */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-semibold mt-3">Syncing blog articles...</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-xl shadow-sm">
          <span className="text-4xl">📚</span>
          <h3 className="text-base font-bold text-slate-800 mt-4">No Blogs Found</h3>
          <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto">
            No articles match filters. Connect your database to browse seeded guides.
          </p>
        </div>
      )}

    </div>
  );
};

export default Blogs;
