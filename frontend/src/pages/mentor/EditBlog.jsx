import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getBlogById, updateBlog } from '../../api/blogs';
import { useToast } from '../../context/ToastContext';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES = ['Web Development', 'Machine Learning', 'Programming Languages', 'Cloud Computing', 'UI/UX Design', 'General'];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getBlogById(id);
        const b = res.blog;
        setTitle(b.title);
        setExcerpt(b.excerpt);
        setContent(b.content);
        setCategory(b.category);
        setThumbnail(b.thumbnail || '');
        setTags(b.tags?.join(', ') || '');
      } catch (err) {
        console.error('Failed to load blog details:', err);
        error('Failed to load blog data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      error('Please write article title, excerpt, and content');
      return;
    }

    setSubmitting(true);
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await updateBlog(id, {
        title,
        excerpt,
        content,
        category,
        thumbnail,
        tags: tagsArray,
      });

      if (res.success) {
        success('Article details updated! 🎉');
        navigate('/mentor/blogs');
      }
    } catch (err) {
      error('Failed to save modifications.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing blog data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-left">
      <Link to="/mentor/blogs" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1.5 mb-6">
        &larr; Back to Dashboard
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-8">Edit Article Content</h1>

      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm">
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Article Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Understanding Assembly compile states in Rust"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Rust, Compilers"
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
              Excerpt (Brief preview text)
            </label>
            <input
              type="text"
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Provide a brief preview text..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Article Content
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full content details..."
              rows="12"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? 'Saving modifications...' : 'Save Article Changes'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default EditBlog;
