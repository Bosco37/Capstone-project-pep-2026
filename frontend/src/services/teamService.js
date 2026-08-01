import api from './api';

const createTeam = async (teamData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await api.post('/teams', teamData, config);
  return response.data;
};

const getMyTeams = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await api.get('/teams/myteams', config);
  return response.data;
};

const joinTeam = async (teamId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await api.post(`/teams/${teamId}/join`, {}, config);
  return response.data;
};

const teamService = {
  createTeam,
  getMyTeams,
  joinTeam,
};

export default teamService;
