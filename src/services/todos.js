import axios from "axios";

const baseUrl = "https://young-cove-50323.herokuapp.com/todos";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const update = async (id, newTodo) => {
  const response = await axios.put(`${baseUrl}/${id}`, newTodo);
  return response.data;
};

const _delete = async (id) => {
  await axios.delete(`${baseUrl}/${id}`);
  return id;
};

const add = async (newTodo) => {
  const response = await axios.post(`${baseUrl}`, newTodo);
  return response.data;
};

export default { getAll, update, delete: _delete, add };
