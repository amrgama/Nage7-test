import axios from "axios";

async function getAll(params) {
  const response = await axios.get("/exam", { params });
  return response;
}

async function getById(id) {
  const response = await axios.get(`/exam/${id}`);
  return response;
}

async function add(data) {
  const response = await axios.post("/exam", data);
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/exam/${id}`, data);
  return response;
}

async function deleteById(id) {
  const response = await axios.delete(`/exam/${id}`);
  return response;
}
const examServices = {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};
export default examServices;
