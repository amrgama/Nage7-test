import axios from "axios";

async function getAllUsers(params) {
  const response = await axios.get("/", { params });
  return response;
}

async function getUserInfo(userId) {
  const response = await axios.get(`/userInfo/${userId}`);
  return response;
}

export default {
  getAllUsers,
  getUserInfo,
};
