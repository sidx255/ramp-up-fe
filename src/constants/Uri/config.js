const BASE_URL = 'http://localhost:5500';

const authUri = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
};

const homeUri = {
  myEvents: `${BASE_URL}/myEvents`,
  availableRooms: `${BASE_URL}/availableRooms`,
  createEvent: `${BASE_URL}/event`,
  deleteEvent: `${BASE_URL}/event`,
  editEvent: `${BASE_URL}/event`,
  getAllUsers: `${BASE_URL}/allUsers`,
};

const teamsUri = {
  getTeams: `${BASE_URL}/teams`,
  getTeamEvents: `${BASE_URL}/events/team/*`,
  createTeams: `${BASE_URL}/teams/create`,
  addTeamEvent: `${BASE_URL}/event`,
  addToTeam: `${BASE_URL}/team/*/addUser`,
  removeFromTeam: `${BASE_URL}/team/*/removeUser`,
  deleteTeam: `${BASE_URL}/team/*`
};

const roomsUri = {
  getRooms: `${BASE_URL}/rooms/availability`,
  searchRooms: `${BASE_URL}/rooms`
};

module.exports = {
  BASE_URL,
  authUri,
  homeUri,
  teamsUri,
  roomsUri
};