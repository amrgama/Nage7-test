import axios from "axios";

async function getAll(params) {
  const response = await axios.get("/post/home", { params });
  return response;
}

async function getById(id) {
  const response = await axios.get(`/post/${id}`);
  return response;
}

async function add(data) {
  const response = await axios.post("/post", data);
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/post/${id}`, data);
  return response;
}

async function deleteById(id) {
  const response = await axios.delete(`/post/${id}`);
  return response;
}
const postServices = {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};
export default postServices;
