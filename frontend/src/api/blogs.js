import api from './axios';

export const getBlogs = async (params) => {
  const res = await api.get('/blogs', { params });
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
};

export const createBlog = async (blogData) => {
  const res = await api.post('/blogs', blogData);
  return res.data;
};

export const updateBlog = async (id, blogData) => {
  const res = await api.put(`/blogs/${id}`, blogData);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};

export const likeBlog = async (id) => {
  const res = await api.post(`/blogs/${id}/like`);
  return res.data;
};

export const commentOnBlog = async (id, content) => {
  const res = await api.post(`/blogs/${id}/comment`, { content });
  return res.data;
};

export const deleteBlogComment = async (blogId, commentId) => {
  const res = await api.delete(`/blogs/${blogId}/comment/${commentId}`);
  return res.data;
};

export const getMentorBlogs = async () => {
  const res = await api.get('/blogs/mentor/me');
  return res.data;
};
