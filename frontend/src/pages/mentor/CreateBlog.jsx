import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBlog } from '../../api/blogs';
import { useToast } from '../../context/ToastContext';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES = ['Web Development', 'Machine Learning', 'Programming Languages', 'Cloud Computing', 'UI/UX Design', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      error('Please fill in article title, excerpt, and content');
      return;
    }

    setSubmitting(true);
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await createBlog({
        title,
        excerpt,
        content,
        category,
        thumbnail: thumbnail || undefined,
        tags: tagsArray,
      });

      if (res.success) {
        success('Article published successfully! 🎉');
        navigate('/mentor/blogs');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to publish article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-left">
      <Link to="/mentor/blogs" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1.5 mb-6">
        &larr; Back to Dashboard
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-8">Draft New Article</h1>

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
                placeholder="e.g. Rust, Compilers, Assembly"
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
              placeholder="Provide a one or two sentence summary for catalog lists..."
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
              placeholder="Write the full content details of your technical explanation here..."
              rows="12"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? 'Publishing article...' : 'Publish Article'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateBlog;
