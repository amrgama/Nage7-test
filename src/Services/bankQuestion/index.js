import axios from "axios";

async function add(data) {
  const response = await axios.post(
    "/questions",
    { ...data},
    {
      // _opts: { noToast: false },
    }
  );
  return response;
}
async function update(data) {
  const response = await axios.put(
    "/questions/single",
    data,
    {
      // _opts: { noToast: false },
    }
  );
  return response;
}

async function updateById(data) {
  const response = await axios.put("/questions", data, {
    // _opts: { noToast: false },
  });
  return response;
}
async function deleteById(id) {
  const response = await axios.delete(`/questions/${id}`);
  return response;
}

async function getAll(params) {
  const response = await axios.get("/questions", { params });
  return response;
}
async function getById(id) {
  const response = await axios.get(`/questions/${id}`);
  return response;
}

const bankQuestionServices = {
  add,
  updateById,
  deleteById,
  getAll,
  getById,
  update
};

export default bankQuestionServices;
