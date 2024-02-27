import axios from "axios";

async function add(data) {
  const response = await axios.post("/group-student", data, {
    // _opts: { noToast: false },
  });
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/group-student/${id}`, data, {
    // _opts: { noToast: false },
  });
  return response;
}
async function deleteById(id) {
  const response = await axios.delete(`/group-student/${id}`, {
    // _opts: { noToast: false },
  });
  return response;
}

async function getAll(params) {
  const response = await axios.get("/group-student", { params });
  return response;
}
async function getById(id) {
  const response = await axios.get(`/group-student/${id}`);
  return response;
}
async function print(data) {
  const response = await axios.post(`/group-student/print`, data);
  return response;
}

const groupStudentServices = {
  add,
  updateById,
  deleteById,
  getAll,
  getById,
  print,
};
export default groupStudentServices;
