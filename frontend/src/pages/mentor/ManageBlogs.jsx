import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMentorBlogs, deleteBlog } from '../../api/blogs';
import { useToast } from '../../context/ToastContext';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchBlogs = async () => {
    try {
      const res = await getMentorBlogs();
      setBlogs(res.blogs || []);
    } catch (err) {
      console.error('Failed to load mentor blogs:', err);
      error('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const res = await deleteBlog(id);
      if (res.success) {
        success('Article deleted successfully.');
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      error('Failed to delete blog.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing blogs feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Blogs Publisher</h1>
          <p className="text-slate-500 text-xs mt-1">
            Write engineering resources, share system design tutorials, and inspect readership trends.
          </p>
        </div>
        <Link
          to="/mentor/blogs/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-lg shadow-sm transition text-center"
        >
          ✍️ Draft New Article
        </Link>
      </div>

      {/* Grid List */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Article Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-600 font-medium">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={blog.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100'}
                          alt={blog.title}
                          className="w-12 aspect-video rounded object-cover bg-slate-50 border"
                        />
                        <span className="truncate max-w-[250px]">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{blog.category}</td>
                    <td className="px-6 py-4">{blog.views || 0} hits</td>
                    <td className="px-6 py-4">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          to={`/blogs/${blog._id}`}
                          className="text-slate-500 hover:text-indigo-600 font-bold transition"
                        >
                          View
                        </Link>
                        <Link
                          to={`/mentor/blogs/edit/${blog._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-bold transition"
                        >
                          Edit Content
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-rose-500 hover:text-rose-700 font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-4xl">🏜️</span>
            <h3 className="text-base font-bold text-slate-850 mt-3">No Articles Drafted</h3>
            <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto">
              You haven't written any blogs yet. Click "Draft New Article" above to add your first post!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageBlogs;
