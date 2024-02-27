import axios from "axios";

async function getExamModules(params) {
  const response = await axios.get("/exam-model", { params });
  return response;
}

async function getExamModuleById(id) {
  const response = await axios.get(`/exam-model/${id}`);
  return response;
}

async function createExamModule(data) {
  const response = await axios.post("/exam-model", data);
  return response;
}

async function updateExamModule(id, data) {
  const response = await axios.put(`/exam-model/${id}`, data);
  return response;
}

async function deleteExamModule(id) {
  const response = await axios.delete(`/exam-model/${id}`);
  return response;
}

export default {
  getExamModules,
  getExamModuleById,
  createExamModule,
  updateExamModule,
  deleteExamModule,
};
