import axios from "axios";

async function adminSignIn(data) {
  const response = await axios.post("/signin", data, {
    _opts: { noToast: false },
  });
  return response;
}

async function adminUpdateProfile(data) {
  const response = await axios.put("/updateProfile", data, {
    _opts: { noToast: false },
  });
  return response;
}
async function adminAddUser(data) {
  const response = await axios.post("/addUser", data, {
    _opts: { noToast: false },
  });
  return response;
}

async function adminUpdateUser(data) {
  const response = await axios.put("/updateUser", data, {
    _opts: { noToast: false },
  });
  return response;
}

async function getUserInfo(params) {
  const response = await axios.get("/userInfo", {
    params,
  });
  return response;
}

async function adminDeleteUser(data) {
  const response = await axios.delete("/account", {
    data,
    _opts: { noToast: false },
  });
  return response;
}

async function adminAddTeacher(data) {
  const response = await axios.post("/add-user", data, {
    _opts: { noToast: false },
  });
  return response;
}

async function adminUpdateTeacher(data) {
  const response = await axios.put("/updateUser", data, {
    _opts: { noToast: false },
  });
  return response;
}

async function changeUserStatus(data) {
  const response = await axios.put("/activate", data, {
    _opts: { noToast: false },
  });
  return response;
}

export default {
  adminSignIn,
  adminUpdateProfile,
  adminAddUser,
  adminUpdateUser,
  getUserInfo,
  adminDeleteUser,
  adminAddTeacher,
  adminUpdateTeacher,
  changeUserStatus,
};
