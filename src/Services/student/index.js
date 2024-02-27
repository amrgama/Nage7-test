import axios from "axios";

async function add(data) {
  const response = await axios.post(
    "/group-student/student/v2",
    { ...data, type: "STUDENT" },
    {
      // _opts: { noToast: false },
    }
  );
  return response;
}

async function updateById(data) {
  const response = await axios.put("group-student/student", data, {
    // _opts: { noToast: false },
  });
  return response;
}
async function deleteById(id) {
  const response = await axios.delete("/group-student/student", {
    data: { student: id },
    // _opts: { noToast: false },
  });
  return response;
}

async function getAll(params) {
  const response = await axios.get("/", {
    params: { teacherStudents: true, ...params, type: "STUDENT" },
  });
  return response;
}
async function getById(id) {
  const response = await axios.get(`/userInfo/${id}`);
  return response;
}
async function getPhoneList(phone) {
  const response = await axios.post(
    `/exist-phone-list`,
    {
      phone,
    },
    { params: { type: "STUDENT" } }
  );
  response.data.data = response.data.users;
  return response;
}
const studentServices = {
  add,
  updateById,
  deleteById,
  getAll,
  getById,
  getPhoneList,
};

export default studentServices;
