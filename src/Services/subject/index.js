import axios from "axios";

async function add(data) {
  const response = await axios.post("/subject", data, {
    // _opts: { noToast: false },
  });
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/subject/${id}`, data, {
    // _opts: { noToast: false },
  });
  return response;
}
async function deleteById(id) {
  const response = await axios.delete(`/subject/${id}`, {
    // _opts: { noToast: false },
  });
  return response;
}

async function getAll(params) {
  const response = await axios.get("/subject", { params });
  return response;
}
async function getById(id) {
  const response = await axios.get(`/subject/${id}`);
  return response;
}

const subjectServices = {
  add,
  updateById,
  deleteById,
  getAll,
  getById,
};
export default subjectServices;
