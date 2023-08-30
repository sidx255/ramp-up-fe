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

module.exports = {
  authUri,
  homeUri,
};