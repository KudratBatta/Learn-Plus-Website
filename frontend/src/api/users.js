import api from './axios';

export const getMentors = async () => {
  const res = await api.get('/users/mentors');
  return res.data;
};

export const getMentorById = async (id) => {
  const res = await api.get(`/users/mentors/${id}`);
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await api.get('/users/dashboard/stats');
  return res.data;
};

// Certificate APIs
export const generateCertificate = async (courseId) => {
  const res = await api.post('/certificates/generate', { courseId });
  return res.data;
};

export const getMyCertificates = async () => {
  const res = await api.get('/certificates/my/all');
  return res.data;
};

export const getCertificateById = async (id) => {
  const res = await api.get(`/certificates/${id}`);
  return res.data;
};
