import axios from "axios";

async function add(data) {
  const response = await axios.post("/attend-lecture", data, {
    // _opts: { noToast: false },
  });
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/attend-lecture/${id}`, data, {
    // _opts: { noToast: false },
  });
  return response;
}
async function deleteById(id) {
  const response = await axios.delete(`/attend-lecture/${id}`, {
    // _opts: { noToast: false },
  });
  return response;
}

async function getAll(params) {
  const response = await axios.get("/attend-lecture", { params });
  return response;
}
async function getById(id) {
  const response = await axios.get(`/attend-lecture/${id}`);
  return response;
}

const lectureServices = {
  add,
  updateById,
  deleteById,
  getAll,
  getById,
};
export default lectureServices;
