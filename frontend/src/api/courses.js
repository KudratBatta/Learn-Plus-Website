import api from './axios';

export const getCourses = async (params) => {
  const res = await api.get('/courses', { params });
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

export const createCourse = async (courseData) => {
  const res = await api.post('/courses', courseData);
  return res.data;
};

export const updateCourse = async (id, courseData) => {
  const res = await api.put(`/courses/${id}`, courseData);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};

export const enrollInCourse = async (id) => {
  const res = await api.post(`/courses/${id}/enroll`);
  return res.data;
};

export const getMyEnrolledCourses = async () => {
  const res = await api.get('/courses/enrolled/me');
  return res.data;
};

export const updateLessonProgress = async (courseId, lessonId) => {
  const res = await api.put(`/courses/${courseId}/progress`, { lessonId });
  return res.data;
};

export const completeCourse = async (courseId) => {
  const res = await api.post(`/courses/${courseId}/complete`);
  return res.data;
};

export const unenrollFromCourse = async (courseId) => {
  const res = await api.post(`/courses/${courseId}/unenroll`);
  return res.data;
};



export const getMentorCourses = async () => {
  const res = await api.get('/courses/mentor/me');
  return res.data;
};

export const getMentorEnrollments = async () => {
  const res = await api.get('/courses/mentor/students');
  return res.data;
};

export const rateCourse = async (courseId, rating, review) => {
  const res = await api.post(`/courses/${courseId}/rate`, { rating, review });
  return res.data;
};

export const getAIRecommendations = async () => {
  const res = await api.get('/courses/recommendations/me');
  return res.data;
};
