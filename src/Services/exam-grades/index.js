import axios from "axios";

async function getAll(params) {
  const response = await axios.get("/exam-grade", { params });
  return response;
}

async function getById(id) {
  const response = await axios.get(`/exam-grade/${id}`);
  return response;
}

async function add(data) {
  const response = await axios.post("/exam-grade", data);
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/exam-grade/${id}`, data);
  return response;
}

async function deleteById(id) {
  const response = await axios.delete(`/exam-grade/${id}`);
  return response;
}
const examGradeServices = {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};
export default examGradeServices;
