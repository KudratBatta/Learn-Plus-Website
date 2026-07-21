import React, { useEffect, useMemo, useState } from 'react';



import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { useAuth } from '../context/AuthContext';
import { likeBlog } from '../api/blogs';

const BlogCard = ({ blog }) => {
  const { user, isAuthenticated } = useAuth();
  const [loadingLike, setLoadingLike] = useState(false);

  const likedByUser = useMemo(() => {
    // blog.likes: array of user ids
    if (!blog?.likes) return false;
    if (!user?._id && !user?.id) return false;
    const uid = user?._id || user?.id;
    return blog.likes.map(String).includes(String(uid));
  }, [blog?.likes, user]);

  const [likedLocal, setLikedLocal] = useState(false);
  useEffect(() => {
    setLikedLocal(likedByUser);
  }, [likedByUser]);


  const formatDate = (dateStr) => {

    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const DEFAULT_OLD_THUMBNAIL =
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop';

  const getDeterministicThumbnail = (blogData) => {
    const thumb = blogData?.thumbnail;
    // If DB already contains the old default, treat it as "missing"
    if (thumb && thumb !== DEFAULT_OLD_THUMBNAIL) return thumb;

    const seed = (blogData?._id || blogData?.title || '').toString();
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
  };

  const thumbnailSrc = getDeterministicThumbnail(blog);

  const likesCount = blog?.likes?.length ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
      
      {/* Thumbnail */}

      <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
        <img
          src={thumbnailSrc}
          alt={blog.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = thumbnailSrc;
          }}
        />
        <span className="absolute bottom-3 left-3 bg-indigo-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded backdrop-blur-sm">
          {blog.category || 'Tech'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-semibold">
            <span>
              {(() => {
                const seed = (blog?._id || blog?.title || '').toString();
                let hash = 0;
                for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;

                const year = hash % 2 === 0 ? 2025 : 2026;
                const month = (hash % 12) + 1;
                const day = (hash % 28) + 1;

                return formatDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`);
              })()}
            </span>

          </div>

          <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-2 hover:text-indigo-600 transition">
            <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
          </h3>
          
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-4">

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={async () => {
                if (!isAuthenticated) return;
                setLoadingLike(true);
                try {
                  const res = await likeBlog(blog._id);
                  // backend returns: { likesCount, liked }
                  setLikedLocal(!!res?.liked);
                } catch (e) {
                  // keep UI as-is on error
                } finally {
                  setLoadingLike(false);
                }

              }}
              className="p-1 rounded-full hover:bg-slate-100 transition"
              aria-label={likedLocal ? 'Unlike blog' : 'Like blog'}
              disabled={!isAuthenticated || loadingLike}
            >
              <svg
                className={`w-4 h-4 ${likedLocal ? 'text-rose-500 fill-rose-500' : 'text-slate-400'} transition`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                fill={likedLocal ? 'currentColor' : 'none'}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61c-1.54-1.52-4.03-1.52-5.57 0L12 7.88l-3.27-3.27c-1.54-1.52-4.03-1.52-5.57 0-1.56 1.52-1.56 4 0 5.52l3.27 3.27L12 21.23l5.57-7.83 3.27-3.27c1.56-1.52 1.56-4 0-5.52z" />
              </svg>
            </button>



            <UserAvatar
              user={blog.author}
              className="w-7 h-7 ring-1 ring-slate-100"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700">{blog.author?.name || 'Mentor'}</span>
              <span className="text-[9px] text-slate-400">{blog.author?.expertise?.[0] || 'Instructor'}</span>
            </div>
          </div>
          
          <Link
            to={`/blogs/${blog._id}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group transition"
          >
            Read Post
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
