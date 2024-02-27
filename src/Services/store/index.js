import axios from "axios";

async function getAll(params) {
  const response = await axios.get("/store", { params });
  return response;
}

async function getById(id) {
  const response = await axios.get(`/store/${id}`);
  return response;
}

async function add(data) {
  const response = await axios.post("/store", data);
  return response;
}
async function uploadFile (data) {
  const response = await axios.post("/uploader/uploadImage", data);
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/store/${id}`, data);
  return response;
}

async function deleteById(id) {
  const response = await axios.delete(`/store/${id}`);
  return response;
}
const storeServices = {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
  uploadFile
};
export default storeServices;
