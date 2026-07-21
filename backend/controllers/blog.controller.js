import Blog from '../models/Blog.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private (Requires login)
export const getBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;

    const query = { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by ID / slug
// @route   GET /api/blogs/:id
// @access  Private
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar bio expertise')
      .populate('comments.user', 'name avatar');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private (Mentors only)
export const createBlog = async (req, res) => {
  try {
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only mentors can create blog posts' });
    }

    const blogData = {
      ...req.body,
      author: req.user.id,
    };

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private (Blog Author only)
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Verify ownership
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this blog' });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Blog Author only)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Verify ownership
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like / Unlike a blog post
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const likeIndex = blog.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Already liked, so unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(req.user.id);
    }

    await blog.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, likesCount: blog.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Comment on a blog post
// @route   POST /api/blogs/:id/comment
// @access  Private
export const commentBlog = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Please add comment content' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const newComment = {
      user: req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      content,
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ success: true, comments: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/blogs/:id/comment/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = blog.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check comment owner or blog owner or admin
    if (
      comment.user.toString() !== req.user.id &&
      blog.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    blog.comments = blog.comments.filter((c) => c._id.toString() !== req.params.commentId);
    await blog.save();

    res.status(200).json({ success: true, comments: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get blogs created by a mentor
// @route   GET /api/blogs/mentor/me
// @access  Private (Mentors only)
export const getBlogsByMentor = async (req, res) => {
  try {
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only mentors can access this route' });
    }

    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
