import axios from 'axios';

const makeRequest = async (url, method, data, headers = {}, params = {}) => {
  const response = await axios({
    url,
    method,
    data,
    headers: headers,
    params: params,
  });

  return response.data;

};

export default makeRequest;
