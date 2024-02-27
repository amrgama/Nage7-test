import axios from "axios";

async function getAll(params) {
  const response = await axios.get("/payment-code", { params });
  return response;
}

async function getById(id) {
  const response = await axios.get(`/payment-code/${id}`);
  return response;
}

async function add(data) {
  const response = await axios.post("/payment-code", data);
  return response;
}

async function updateById(id, data) {
  const response = await axios.put(`/payment-code/${id}`, data);
  return response;
}

async function deleteById(id) {
  const response = await axios.delete(`/payment-code/${id}`);
  return response;
}
const payementCodeServices = {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};
export default payementCodeServices;
