import axios from "axios";

async function add(data) {
  const response = await axios.post("/assistant", data, {
    // _opts: { noToast: false },
  });
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/assistant/${id}`, data, {
    // _opts: { noToast: false },
  });
  return response;
}
async function deleteById(id) {
  const response = await axios.delete(`/assistant/${id}`, {
    // data,
    // _opts: { noToast: false },
  });
  return response;
}

async function getAll(params) {
  const response = await axios.get("/assistant", {
    params,
  });
  return response;
}
async function getById(id) {
  const response = await axios.get(`/assistant/${id}`);
  return response;
}
const studentServices = {
  add,
  updateById,
  deleteById,
  getAll,
  getById,
};
export default studentServices;
