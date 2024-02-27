import axios from "axios";

async function add(data) {
  const response = await axios.post("/event", data, {
    // _opts: { noToast: false },
  });
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/event/${id}`, data, {
    // _opts: { noToast: false },
  });
  return response;
}
async function deleteById(id) {
  const response = await axios.delete(`/event/${id}`, {
    // _opts: { noToast: false },
  });
  return response;
}

async function getAll(params) {
  const response = await axios.get("/event", { params });
  return response;
}
async function getById(id) {
  const response = await axios.get(`/event/${id}`);
  return response;
}

const eventServices = {
  add,
  updateById,
  deleteById,
  getAll,
  getById,
};
export default eventServices;
