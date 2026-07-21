import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, likeBlog, commentOnBlog, deleteBlogComment } from '../api/blogs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import UserAvatar from '../components/UserAvatar';

const BlogDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchBlog = async () => {
    try {
      const res = await getBlogById(id);
      setBlog(res.blog);
      setLikesCount(res.blog.likes?.length || 0);
      setLiked(res.blog.likes?.includes(user?._id));
    } catch (err) {
      console.error('Error fetching blog:', err);
      error('Failed to load article details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      error('Please sign in to like articles');
      return;
    }

    try {
      const res = await likeBlog(blog._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
      if (res.liked) {
        success('Liked article! ❤️');
      }
    } catch (err) {
      error('Failed to toggle like.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      error('Please enter comment text');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await commentOnBlog(blog._id, commentContent);
      success('Comment added successfully!');
      setBlog((prev) => ({ ...prev, comments: res.comments }));
      setCommentContent('');
    } catch (err) {
      error('Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteBlogComment(blog._id, commentId);
      success('Comment deleted.');
      setBlog((prev) => ({ ...prev, comments: res.comments }));
    } catch (err) {
      error('Failed to delete comment.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">Syncing article content...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold text-slate-800 mt-4">Article Not Found</h2>
        <Link to="/blogs" className="text-indigo-600 font-semibold text-sm hover:underline mt-2 inline-block">
          Go back to Blogs
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSeededCreationDate = (blogData) => {
    const seed = (blogData?._id || blogData?.title || '').toString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;

    const year = hash % 2 === 0 ? 2025 : 2026;
    const month = (hash % 12) + 1;
    const day = (hash % 28) + 1;

    return formatDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Back Link */}
      <Link to="/blogs" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1.5 mb-6">
        &larr; Back to Articles Feed
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded border border-indigo-100">
          {blog.category}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-850 mt-4 mb-4 leading-tight">
          {blog.title}
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
          {blog.excerpt}
        </p>

        {/* Author Card */}
        <div className="flex items-center justify-between border-y border-slate-100 py-4 mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar
              user={blog.author}
              className="w-10 h-10 ring-2 ring-indigo-50"
              textClassName="text-sm"
            />
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{blog.author?.name}</p>
              <span className="text-[10px] text-slate-400 font-semibold">{blog.author?.expertise?.[0] || 'Instructor'}</span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p>Published: {formatSeededCreationDate(blog)}</p>
          </div>
        </div>
      </div>

      {/* Article Image */}
      <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-8 shadow-sm">
        <img
          src={(() => {
            const DEFAULT_OLD_THUMBNAIL =
              'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop';
            const thumb = blog?.thumbnail;

            // If DB already contains the old default, treat it as "missing"
            if (thumb && thumb !== DEFAULT_OLD_THUMBNAIL) return thumb;

            const seed = (blog?._id || blog?.title || '').toString();
            let hash = 0;
            for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;

            const images = [
              'https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://plus.unsplash.com/premium_photo-1671462506754-f0ff9d24abb6?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1667372335962-5fd503a8ae5b?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1667984390553-7f439e6ae401?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1614064548237-096f735f344f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1657812159077-90649115008c?q=80&w=826&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1648134859186-a05fb609f41e?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1486326659225-a7ec5b2b3e3b?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1634084462412-b54873c0a56d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop',
            ];

            return images[hash % images.length];
          })()}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Body */}
      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6 border-b border-slate-150 pb-8 mb-8 whitespace-pre-wrap">
        {blog.content}
      </div>

      {/* Reactions Section */}
      <div className="flex items-center justify-between py-4 border-b border-slate-100 mb-10">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition border ${
            liked
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likesCount} Likes</span>
        </button>
        
        <span className="text-xs text-slate-400 font-bold">{blog.comments?.length || 0} Comments</span>
      </div>

      {/* ─── Comments Section ─── */}
      <section className="space-y-6">
        <h3 className="text-lg font-black text-slate-800">Discussion Feed</h3>

        {/* Add comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="flex gap-4">
            <UserAvatar
              user={user}
              className="w-9 h-9 mt-1"
            />
            <div className="flex-grow flex flex-col items-start gap-3">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Join the discussion... write comments here."
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-slate-100 border border-slate-200/50 rounded-xl text-xs text-slate-500">
            Please{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              login
            </Link>{' '}
            to participate in comments.
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-4">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comm) => (
              <div key={comm._id} className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <UserAvatar
                  user={{ name: comm.userName, avatar: comm.userAvatar }}
                  className="w-7 h-7"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{comm.userName}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{formatDate(comm.createdAt)}</span>
                    </div>

                    {/* Delete authority checks */}
                    {isAuthenticated && (comm.user === user._id || blog.author._id === user._id) && (
                      <button
                        onClick={() => handleDeleteComment(comm._id)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{comm.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-xs italic">No comments yet. Start the conversation!</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default BlogDetail;
