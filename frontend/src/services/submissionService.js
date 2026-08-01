import api from './api';

const createSubmission = async (submissionData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await api.post('/submissions', submissionData, config);
  return response.data;
};

const getSubmissions = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await api.get('/submissions', config);
  return response.data;
};

const evaluateSubmission = async (id, evaluationData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await api.put(`/submissions/${id}/evaluate`, evaluationData, config);
  return response.data;
};

const getLeaderboard = async (hackathonId) => {
  const response = await api.get(`/submissions/leaderboard/${hackathonId}`);
  return response.data;
};

const submissionService = {
  createSubmission,
  getSubmissions,
  evaluateSubmission,
  getLeaderboard,
};

export default submissionService;
