import axios from 'axios';

const makeRequest = async (url, method, data, headers = {}) => {
  const response = await axios({
    url,
    method,
    data,
    headers: headers
  });

  return response.data;

};

export default makeRequest;
