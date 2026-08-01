import api from './api';

const getHackathons = async (query = '') => {
  const response = await api.get(`/hackathons${query}`);
  return response.data;
};

const getHackathonById = async (id) => {
  const response = await api.get(`/hackathons/${id}`);
  return response.data;
};

const createHackathon = async (hackathonData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/hackathons', hackathonData, config);
  return response.data;
};

const deleteHackathon = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.delete(`/hackathons/${id}`, config);
  return response.data;
};

const hackathonService = {
  getHackathons,
  getHackathonById,
  createHackathon,
  deleteHackathon,
};

export default hackathonService;
