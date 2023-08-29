import axios from 'axios';

const makeRequest = async (url, method, data) => {
  const response = await axios({
    url,
    method,
    data,
  });

  return response.data;

};

export default makeRequest;
