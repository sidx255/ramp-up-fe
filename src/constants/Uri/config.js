const BASE_URL = 'http://localhost:5500';

const authUri = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
};

const homeUri = {
  myEvents: `${BASE_URL}/myEvents`,
  availableRooms: `${BASE_URL}/availableRooms`,
  createEvent: `${BASE_URL}/event`,
  getAllUsers: `${BASE_URL}/allUsers`,
};

const teamsUri = {
  getTeams: `${BASE_URL}/teams`,
  createTeams: `${BASE_URL}/teams/create`,
  addToTeam: `${BASE_URL}/team/*/addUser`,
  removeFromTeam: `${BASE_URL}/team/*/removeUser`,
  deleteTeam: `${BASE_URL}/team/*`
};

module.exports = {
  authUri,
  homeUri,
  teamsUri
};