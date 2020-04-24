import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs/';

let token = null;

const setToken = (newToken) => {
  return (token = `Bearer ${newToken}`);
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log('newObject', newObject);
  const response = await axios.post(baseUrl, newObject, config);
  console.log(response.data);
  return response.data;
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl} /${id}`, newObject);
  return request.then((response) => response.data);
};

export default { getAll, create, setToken, update };
